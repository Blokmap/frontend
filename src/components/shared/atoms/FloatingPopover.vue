<script lang="ts" setup>
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { ref, watchEffect, onMounted, onUnmounted, computed } from 'vue';
import { useFloatingOverlayManager } from '@/composables/useFloatingOverlayManager';

const VERTICAL_GAP = 16;
const HORIZONTAL_MARGIN = 12;
const VERTICAL_MARGIN = 8;

const props = withDefaults(
    defineProps<{
        targetRef: HTMLElement | null;
        centered?: boolean;
        fullscreenMobile?: boolean;
    }>(),
    {
        centered: true,
        fullscreenMobile: false,
    },
);

const visible = defineModel<boolean>('visible', {
    default: false,
});

const popoverRef = ref<HTMLElement | null>(null);
const styles = ref<Record<string, string>>({});
const arrowStyles = ref<Record<string, string>>({});
const isArrowBelow = ref(false);

const shouldAnimate = ref<boolean>(false);
const previousTarget = ref<HTMLElement | null>(null);

const { register, unregister, closeAll } = useFloatingOverlayManager();

const breakpoints = useBreakpoints(breakpointsTailwind);
const isMobile = breakpoints.smaller('md');

const isFullscreen = computed(() => {
    return props.fullscreenMobile && isMobile.value;
});

const position = (): void => {
    const trigger = props.targetRef;
    const popover = popoverRef.value;
    if (!trigger || !popover || isFullscreen.value) return;

    const triggerRect = trigger.getBoundingClientRect();
    const popoverRect = popover.getBoundingClientRect();
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    // Vertical: position below or above based on available space
    const spaceBelow = window.innerHeight - triggerRect.bottom;
    const positionBelow = spaceBelow >= popoverRect.height || spaceBelow > triggerRect.top;

    const top = positionBelow
        ? triggerRect.bottom + scrollY + VERTICAL_GAP
        : triggerRect.top + scrollY - popoverRect.height - VERTICAL_GAP;

    // Horizontal: center on trigger or align with right edge
    let left = props.centered
        ? triggerRect.left + scrollX + triggerRect.width / 2 - popoverRect.width / 2
        : triggerRect.right + scrollX - popoverRect.width;

    left = Math.max(
        scrollX + HORIZONTAL_MARGIN,
        Math.min(left, scrollX + window.innerWidth - popoverRect.width - HORIZONTAL_MARGIN),
    );

    // Constrain vertical to viewport
    const finalTop = Math.max(
        scrollY + VERTICAL_MARGIN,
        Math.min(top, scrollY + window.innerHeight - popoverRect.height - VERTICAL_MARGIN),
    );

    // Calculate arrow position - centered on trigger, constrained to popover bounds
    const triggerCenterX = triggerRect.left + scrollX + triggerRect.width / 2;
    const popoverLeft = left;
    const idealArrowLeft = triggerCenterX - popoverLeft;

    // Constrain arrow to stay within popover with 16px margin from edges
    const arrowMargin = 16;
    const arrowLeft = Math.max(
        arrowMargin,
        Math.min(idealArrowLeft, popoverRect.width - arrowMargin),
    );

    isArrowBelow.value = !positionBelow;

    styles.value = {
        top: `${Math.round(finalTop)}px`,
        left: `${Math.round(left)}px`,
    };

    arrowStyles.value = {
        left: `${Math.round(arrowLeft)}px`,
    };
};

const closeMe = () => {
    visible.value = false;
};

const onClick = (e: MouseEvent) => {
    if (
        !popoverRef.value?.contains(e.target as Node) &&
        !props.targetRef?.contains(e.target as Node)
    ) {
        visible.value = false;
    }
};

watchEffect(() => {
    if (visible.value && props.targetRef && popoverRef.value) {
        const currentTarget = props.targetRef;

        if (previousTarget.value === null) {
            closeAll(closeMe);
            register(closeMe);
            shouldAnimate.value = false;
        } else if (previousTarget.value !== currentTarget) {
            shouldAnimate.value = true;
        }

        previousTarget.value = currentTarget;
        position();
    } else if (!visible.value && previousTarget.value) {
        unregister(closeMe);
        previousTarget.value = null;
        shouldAnimate.value = false;
    }
});

onMounted(() => {
    document.addEventListener('click', onClick);
    window.addEventListener('resize', position);
});

onUnmounted(() => {
    document.removeEventListener('click', onClick);
    window.removeEventListener('resize', position);
    unregister(closeMe);
});
</script>

<template>
    <Teleport to="body">
        <!-- Mobile Backdrop -->
        <Transition name="fade">
            <div
                v-if="visible && isFullscreen"
                class="popover-backdrop"
                @click="visible = false"></div>
        </Transition>

        <!-- Popover Content -->
        <Transition :name="isFullscreen ? 'slide-up' : 'slide-down'">
            <div
                v-if="visible"
                ref="popoverRef"
                :style="!isFullscreen ? styles : {}"
                :class="[
                    { 'popover-animate': shouldAnimate && !isFullscreen },
                    isFullscreen ? 'popover-fullscreen' : 'popover',
                ]">
                <div
                    v-if="!isFullscreen"
                    class="popover-arrow"
                    :class="{ 'popover-arrow--below': isArrowBelow }"
                    :style="arrowStyles"></div>
                <slot></slot>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.popover-backdrop {
    @apply fixed inset-0 z-[1102] bg-black/50;
}

.popover {
    @apply absolute z-[1103] rounded-lg shadow-lg;
}

.popover-fullscreen {
    @apply fixed inset-x-0 bottom-0 z-[1200] rounded-t-xl bg-white shadow-lg;
    @apply max-h-[90vh] overflow-y-auto;
}

.popover-animate {
    @apply transition-discrete duration-200;
}

.popover-arrow {
    @apply absolute -top-[8px] h-0 w-0 -translate-x-1/2;

    &::before,
    &::after {
        @apply absolute left-1/2 -translate-x-1/2 content-[''];
    }

    &::before {
        @apply top-0 border-r-[9px] border-b-[9px] border-l-[9px] border-transparent;
        filter: drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1));
    }

    &::after {
        @apply top-px border-r-[8px] border-b-[8px] border-l-[8px] border-transparent border-b-white;
    }

    &.popover-arrow--below {
        @apply top-auto -bottom-[8px];

        &::before {
            @apply top-auto bottom-0 border-t-[9px] border-b-0;
            filter: drop-shadow(0 -10px 8px rgb(0 0 0 / 0.04))
                drop-shadow(0 -4px 3px rgb(0 0 0 / 0.1));
        }

        &::after {
            @apply top-auto bottom-px border-t-[8px] border-b-0 border-t-white;
        }
    }
}
</style>
