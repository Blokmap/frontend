<script setup lang="ts">
import type { MapAdapter } from '@/types/contract/Map';
import type { Location } from '@/types/schema/Location';
import { faBuildingColumns, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Popover from 'primevue/popover';
import { inject, onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue';

const props = defineProps<{ location: Location; active?: boolean }>();

const emit = defineEmits<{
    (e: 'click'): void;
    (e: 'mouseenter'): void;
    (e: 'mouseleave'): void;
}>();

const popoverRef = useTemplateRef('popover');
const markerRef = useTemplateRef('root');
const map = inject<MapAdapter>('map');

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

function handleMouseEnter(event: MouseEvent) {
    isShowingPopover.value = true;
    popoverRef?.value?.show(event);
    emit('mouseenter');
}

function handleMouseLeave() {
    isShowingPopover.value = false;
    popoverRef.value?.hide();
    emit('mouseleave');
}

function updatePopoverPosition() {
    if (!isShowingPopover.value || !popoverRef.value) return;
    popoverRef.value?.alignOverlay();
}

onMounted(() => {
    if (!markerRef.value) return;

    window.addEventListener('scroll', updatePopoverPosition);

    map?.addMarker({
        id: props.location.id,
        coord: [props.location.longitude, props.location.latitude],
        el: markerRef.value,
    });
});

onUnmounted(() => {
    window.removeEventListener('scroll', updatePopoverPosition);
    map?.removeMarker(props.location.id);
});
</script>

<template>
    <Teleport to="body">
        <div
            ref="root"
            @click.stop="emit('click')"
            @mouseenter="handleMouseEnter"
            @mouseleave="handleMouseLeave">
            <div class="marker" :class="{ active }">
                <FontAwesomeIcon :icon="faLocationDot" class="icon text-slate-50" />
            </div>
        </div>
        <Popover ref="popover">
            <div class="flex items-center gap-1">
                <FontAwesomeIcon :icon="faBuildingColumns" />
                <p class="font-bold">
                    {{ location.name }}
                </p>
            </div>
            <div class="my-2">
                <p>{{ location.street }} {{ location.number }}</p>
                <p>{{ location.zip }} {{ location.city }}</p>
            </div>
        </Popover>
    </Teleport>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.marker {
    @apply flex h-6 w-9 cursor-pointer items-center justify-center rounded-full bg-slate-900 drop-shadow-lg transition-transform duration-200 hover:scale-110;

    &.active {
        @apply scale-110;
    }
}
</style>
