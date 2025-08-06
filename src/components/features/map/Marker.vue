<script setup lang="ts">
import type { MapAdapter } from '@/types/contract/Map';
import type { Location } from '@/types/schema/Location';
import { faBuildingColumns, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Popover from 'primevue/popover';
import { onMounted, ref, useTemplateRef, watch } from 'vue';

const props = defineProps<{ location: Location; active?: boolean; map: MapAdapter }>();

const emit = defineEmits<{
    (e: 'click'): void;
    (e: 'mouseenter'): void;
    (e: 'mouseleave'): void;
}>();

const popoverRef = useTemplateRef('popover');
const markerRef = useTemplateRef('root');

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
    if (!markerRef.value) {
        return;
    }

    window.addEventListener('scroll', () => {
        if (isShowingPopover.value) {
            updatePopoverPosition();
        }
    });

    props.map.setOnMove(() => {
        if (isShowingPopover.value) {
            updatePopoverPosition();
        }
    });

    props.map.addMarker({
        id: props.location.id,
        coord: [props.location.longitude, props.location.latitude],
        el: markerRef.value,
    });
});
</script>

<template>
    <Teleport to="body">
        <div
            ref="root"
            @click.stop="emit('click')"
            @mouseenter="handleMouseEnter"
            @mouseleave="handleMouseLeave">
            <Transition name="marker-popup" appear>
                <div class="marker" :class="{ active }">
                    <FontAwesomeIcon :icon="faLocationDot" class="icon text-slate-50" />
                </div>
            </Transition>
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
    @apply flex h-6 w-9 cursor-pointer items-center justify-center rounded-full bg-slate-800 transition-transform duration-200 hover:scale-110;

    &.active {
        @apply scale-110;
    }
}

.marker-popup-enter-active {
    transition-property: transform, opacity;
    transition-duration: 400ms;
    transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.marker-popup-enter-from {
    transform: scale(0);
    opacity: 0;
}

.marker-popup-enter-to {
    transform: scale(1);
    opacity: 1;
}
</style>
