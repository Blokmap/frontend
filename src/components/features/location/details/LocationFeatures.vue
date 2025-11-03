<script lang="ts" setup>
import { faCalendarWeek, faChair, faClock, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';
import { type Location, getLocationFeatures } from '@/domain/location';

const props = defineProps<{
    location: Location;
}>();

const features = computed(() => {
    return getLocationFeatures(props.location);
});

const featuresList = computed(() => {
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
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="feature in featuresList" :key="feature.title" class="feature">
            <div class="flex-shrink-0">
                <FontAwesomeIcon :icon="feature.icon" :class="['h-5 w-5', feature.iconColor]" />
            </div>
            <div class="min-w-0 flex-1">
                <h4 class="font-medium text-gray-900">
                    {{ feature.title }}
                </h4>
                <p class="mt-1 text-sm text-gray-600">
                    {{ feature.description }}
                </p>
            </div>
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.feature {
    @apply flex items-start gap-3 p-4;
    @apply rounded-xl bg-white shadow-xs;
    @apply transition-all hover:border-slate-300;
}
</style>
