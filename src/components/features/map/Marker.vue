<script setup lang="ts">
import Popover from 'primevue/popover';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { onDeactivated, onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue';
import type { LngLat, MapAdapter } from '@/domain/map';

const props = defineProps<{
    id?: number;
    position?: LngLat;
    active?: boolean;
    map?: MapAdapter;
}>();

const emit = defineEmits<{
    (e: 'click'): void;
    (e: 'mouseenter'): void;
    (e: 'mouseleave'): void;
}>();

const markerRef = useTemplateRef('root');
const popoverRef = useTemplateRef<any>('popover');
const isShowingPopover = ref(false);

watch(
    () => props.active,
    (active) => {
        if (active) {
            isShowingPopover.value = true;
            popoverRef?.value?.show(new Event('mouse'), markerRef.value);
        } else {
            isShowingPopover.value = false;
            popoverRef?.value?.hide();
        }
    },
);

watch(() => props.map?.bounds.value, updatePopoverPosition);

onMounted(() => {
    if (!markerRef.value) return;
    if (!props.id || !props.position) return;

    window.addEventListener('scroll', updatePopoverPosition);

    props.map?.addMarker({
        id: props.id,
        coord: props.position,
        el: markerRef.value,
    });
});

onDeactivated(() => {
    if (isShowingPopover.value) {
        popoverRef?.value?.hide();
        isShowingPopover.value = false;
    }
});

onUnmounted(() => {
    if (!markerRef.value) return;
    if (!props.id || !props.position) return;

    window.removeEventListener('scroll', updatePopoverPosition);
    props.map?.removeMarker(props.id);
});

function handleMouseEnter(event: MouseEvent) {
    isShowingPopover.value = true;
    popoverRef?.value?.show(event);
    emit('mouseenter');
}

function handleMouseLeave() {
    // Don't hide popover on mouse leave - it should stay visible
    emit('mouseleave');
}

function updatePopoverPosition() {
    if (!isShowingPopover.value || !popoverRef.value) return;
    popoverRef.value?.alignOverlay();
}
</script>

<template>
    <Teleport to="body">
        <div
            ref="root"
            @click.stop="emit('click')"
            @mouseenter="handleMouseEnter"
            @mouseleave="handleMouseLeave">
            <Transition name="bounce-scale" appear>
                <div class="marker" :class="{ active }">
                    <FontAwesomeIcon :icon="faLocationDot" class="icon text-slate-50" />
                </div>
            </Transition>
        </div>

        <!-- Popover with slot for custom content -->
        <Popover ref="popover" class="min-w-[300px]">
            <slot name="popover"></slot>
        </Popover>
    </Teleport>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.marker {
    @apply flex h-6 w-9 cursor-pointer items-center justify-center rounded-full bg-slate-800 transition-transform duration-200 hover:scale-110;

    &.active {
        @apply scale-110;
    }
}
</style>
