<script setup lang="ts">
import Popover from 'primevue/popover';
import { onDeactivated, onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue';
import { getLocationImageUrl, type Location } from '@/domain/location';
import type { LngLat, MapAdapter } from '@/domain/map';

const { id, position, map } = defineProps<{
    map: MapAdapter;
    id: number;
    location: Location;
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

/**
 * Close the popover.
 */
function closePopover() {
    popoverRef.value?.hide();
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
                <img class="marker" :src="getLocationImageUrl(location)" alt="Location Image"></img>
            </Transition>
        </div>

        <!-- Popover with slot for custom content -->
        <Popover
            ref="popover"
            class="map-popover mx-2 overflow-hidden"
            @show="isShowingPopover = true"
            @hide="isShowingPopover = false">
            <slot name="popover" :close-popover="closePopover"></slot>
        </Popover>
    </Teleport>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.marker {
    @apply h-11 w-11 object-cover cursor-pointer rounded-full transition-all duration-200 hover:scale-110;

    &.active {
        @apply scale-115;
    }
}
</style>
