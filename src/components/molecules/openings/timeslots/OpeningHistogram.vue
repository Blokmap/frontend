<script lang="ts" setup>
import { computed } from 'vue';
import type { OpeningTimeStats } from '@/domain/openings';

const props = defineProps<{
    stats: OpeningTimeStats;
    seatCount: number;
    binCount?: number | null;
}>();

// Compute histogram bins for occupancy visualization
// Each bin represents the average occupancy for that segment
const bins = computed<{ occupancy: number; ratio: number }[]>(() => {
    const occupancy = Object.entries(props.stats.occupancy);
    const binCount = Math.min(props.binCount ?? occupancy.length, occupancy.length);

    const bins = Array(binCount)
        .fill(0)
        .map(() => ({ sum: 0, count: 0 }));

    for (const [key, value] of occupancy) {
        const index = Math.min(Math.floor((+key * binCount) / occupancy.length), binCount - 1);
        bins[index].sum += value;
        bins[index].count++;
    }

    return bins.map(({ sum, count }) => {
        const avgOccupancy = count > 0 ? sum / count : 0;

        return {
            occupancy: avgOccupancy,
            ratio: avgOccupancy / props.seatCount,
        };
    });
});

function getTooltip(bin: { occupancy: number; ratio: number }) {
    return `${Math.round(bin.occupancy)} / ${props.seatCount}`;
}
</script>

<template>
    <div class="histogram">
        <div
            v-for="(bin, index) in bins"
            :key="index"
            class="histogram__bin"
            :style="{ width: `${bin.ratio * 100}%` }"
            v-tooltip.right="getTooltip(bin)"></div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.histogram {
    @apply flex h-full w-full flex-col;
    @apply pointer-events-none;
    @apply overflow-hidden rounded-lg;

    .histogram__bin {
        @apply flex-1;
        @apply pointer-events-auto;
        @apply bg-black/10 mix-blend-multiply;
    }
}
</style>
