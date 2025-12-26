<script lang="ts" setup>
import Skeleton from 'primevue/skeleton';
import { faCalendarWeek, faChair, faClock, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';
import { type Location, getLocationFeatures } from '@/domain/location';

const props = defineProps<{
    location?: Location;
    loading?: boolean;
}>();

const features = computed(() => {
    return props.location ? getLocationFeatures(props.location) : null;
});

const featuresList = computed(() => {
    if (!props.location || !features.value) return [];

    const list = [];

    if (features.value.openInMorning) {
        list.push({
            icon: faSun,
            title: 'Open in de ochtend',
            description: 'Ideaal voor vroege vogels',
            iconColor: 'text-amber-500',
        });
    }

    if (features.value.openInEvening) {
        list.push({
            icon: faMoon,
            title: 'Open in de avond',
            description: 'Perfect voor nachtbrakers',
            iconColor: 'text-slate-600',
        });
    }

    if (features.value.openInWeekend) {
        list.push({
            icon: faCalendarWeek,
            title: 'Weekend uren',
            description: 'Beschikbaar in het weekend',
            iconColor: 'text-emerald-500',
        });
    }

    if (features.value.openAtNight) {
        list.push({
            icon: faClock,
            title: 'Verlengde uren',
            description: 'Open tot laat in de avond',
            iconColor: 'text-primary-600',
        });
    }

    // Add location-specific features
    if (props.location.isReservable) {
        list.push({
            icon: faCalendarWeek,
            title: 'Reservaties mogelijk',
            description: 'Reserveer je plek van tevoren',
            iconColor: 'text-primary-500',
        });
    }

    if (props.location.seatCount && props.location.seatCount > 0) {
        list.push({
            icon: faChair,
            title: `${props.location.seatCount} zitplaatsen`,
            description: 'Beschikbare zitcapaciteit',
            iconColor: 'text-primary-600',
        });
    }

    return list;
});
</script>

<template>
    <div v-if="loading" class="features-grid">
        <div v-for="n in 4" :key="n" class="flex items-center gap-3">
            <Skeleton width="2rem" height="2rem" />
            <Skeleton width="8rem" height="1rem" />
        </div>
    </div>

    <div v-else class="features-grid">
        <div v-for="feature in featuresList" :key="feature.title" class="feature">
            <div class="feature__icon">
                <FontAwesomeIcon :icon="feature.icon" />
            </div>
            <span class="feature__title">{{ feature.title }}</span>
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.features-grid {
    @apply grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3;
}

.feature {
    @apply flex items-center gap-3 text-lg;
}

.feature__icon {
    @apply flex h-8 w-8 items-center justify-center text-gray-700;
}

.feature__title {
    @apply text-sm text-gray-700;
}
</style>
