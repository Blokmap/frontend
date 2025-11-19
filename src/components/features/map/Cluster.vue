<script setup lang="ts">
import { computed, onMounted, onUnmounted, useTemplateRef } from 'vue';
import type { LngLat, MapAdapter } from '@/domain/map';

const props = defineProps<{
    map: MapAdapter;
    id: string;
    position: LngLat;
    count: number;
}>();

const emit = defineEmits<{
    (e: 'click'): void;
}>();

const clusterRef = useTemplateRef<HTMLElement>('root');

// Calculate cluster size based on count
const clusterSize = computed(() => {
    if (props.count < 5) return 'small';
    if (props.count < 10) return 'medium';
    return 'large';
});

onMounted(() => {
    const el = clusterRef.value;

    if (props.id && props.position && el) {
        props.map?.addMarker({
            id: props.id,
            coord: props.position,
            el,
        });
    }
});

onUnmounted(() => {
    if (!props.id) return;
    props.map?.removeMarker(props.id);
});

function handleClick() {
    emit('click');
}
</script>

<template>
    <Teleport to="body">
        <div ref="root" class="cluster__wrapper" @click="handleClick">
            <Transition name="bounce-scale" appear>
                <div class="cluster" :class="`cluster--${clusterSize}`">
                    <span class="cluster__count">{{ count }}</span>
                </div>
            </Transition>
        </div>
    </Teleport>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.cluster__wrapper {
    @apply cursor-pointer;
}

.cluster {
    @apply relative flex items-center justify-center rounded-full;
    @apply font-bold text-white shadow-xl;
    @apply transition-all duration-200 hover:scale-110;
    @apply border-4 border-white;
}

.cluster::before {
    content: '';
    @apply absolute inset-0 rounded-full;
    @apply from-primary-400 to-primary-600 bg-gradient-to-br;
    @apply opacity-90;
    z-index: -1;
}

.cluster:hover::before {
    @apply opacity-100;
}

.cluster--small {
    @apply h-12 w-12 text-sm;
}

.cluster--medium {
    @apply h-16 w-16 text-base;
}

.cluster--large {
    @apply h-20 w-20 text-lg;
}

.cluster__count {
    @apply drop-shadow-sm select-none;
    position: relative;
    z-index: 1;
}
</style>
