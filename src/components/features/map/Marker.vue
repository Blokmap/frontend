<script setup lang="ts">
import Popover from 'primevue/popover';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { onDeactivated, onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue';
import type { LngLat, MapAdapter } from '@/domain/map';

const { id, position, map } = defineProps<{
    map: MapAdapter;
    id: number;
    position: LngLat;
    active?: boolean;
}>();

const emit = defineEmits<{
    (e: 'click'): void;
    (e: 'mouseenter'): void;
    (e: 'mouseleave'): void;
}>();

const markerRef = useTemplateRef<HTMLElement>('root');
const popoverRef = useTemplateRef<InstanceType<typeof Popover>>('popover');

const isShowingPopover = ref<boolean>(false);

watch(
    () => map?.bounds.value,
    () => {
        if (isShowingPopover.value) {
            popoverRef.value?.alignOverlay();
        }
    },
);

onMounted(() => {
    const el = markerRef.value;

    if (id && position && el) {
        map?.addMarker({
            id,
            coord: position,
            el,
        });
    }
});

onUnmounted(() => {
    if (!id) return;
    map?.removeMarker(id);
});

onDeactivated(() => {
    popoverRef?.value?.hide();
});

/**
 * Handle click event.
 * @param event - Mouse event
 */
function handleClick(event: MouseEvent) {
    emit('click');
    popoverRef.value?.toggle(event);
}

/**
 * Handle mouse enter event.
 */
function handleMouseEnter() {
    emit('mouseenter');
}

/**
 * Handle mouse leave event.
 */
function handleMouseLeave() {
    emit('mouseleave');
}
</script>

<template>
    <Teleport to="body">
        <div
            ref="root"
            @click="handleClick"
            @mouseenter="handleMouseEnter"
            @mouseleave="handleMouseLeave">
            <Transition name="bounce-scale" appear>
                <div class="marker" :class="{ active }">
                    <FontAwesomeIcon :icon="faLocationDot" class="icon text-slate-50" />
                </div>
            </Transition>
        </div>

        <!-- Popover with slot for custom content -->
        <Popover
            ref="popover"
            class="min-w-[350px]"
            @show="isShowingPopover = true"
            @hide="isShowingPopover = false">
            <slot name="popover"></slot>
        </Popover>
    </Teleport>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.marker {
    @apply flex h-6 w-9 cursor-pointer items-center justify-center rounded-full bg-slate-800 transition-all duration-200 hover:scale-110;

    &.active {
        @apply scale-115;
    }
}
</style>
