<script lang="ts" setup>
import type { Location } from '@/domain/location';
import { getLocationPlaceholderImage } from '@/domain/location';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Skeleton from 'primevue/skeleton';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();

const props = withDefaults(
    defineProps<{
        locations: Location[];
        loading?: boolean;
        skeletonItems?: number;
        emptyMessage?: string;
    }>(),
    {
        loading: false,
        skeletonItems: 6,
        emptyMessage: 'No locations found',
    },
);

const emit = defineEmits<{
    locationClick: [location: Location];
}>();

const handleLocationClick = (location: Location) => {
    emit('locationClick', location);
};

const getLocationImageUrl = (location: Location) => {
    if (location.images?.length) {
        return location.images[0].url;
    }
    return getLocationPlaceholderImage(location);
};

const getNextOpeningTimes = (location: Location) => {
    if (!location.openingTimes?.length) return [];

    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Filter opening times for the next week and sort by date/time
    const upcomingOpenings = location.openingTimes
        .filter((opening) => {
            const openingDate = new Date(opening.day);
            return openingDate >= today && openingDate <= nextWeek;
        })
        .sort((a, b) => {
            const dateA = new Date(a.day);
            const dateB = new Date(b.day);
            if (dateA.getTime() !== dateB.getTime()) {
                return dateA.getTime() - dateB.getTime();
            }
            // If same day, sort by start time
            const timeA = a.startTime.hours * 60 + a.startTime.minutes;
            const timeB = b.startTime.hours * 60 + b.startTime.minutes;
            return timeA - timeB;
        });

    return upcomingOpenings.slice(0, 3); // Show max 3 upcoming slots
};

const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const today = new Date();
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

    if (dateObj.toDateString() === today.toDateString()) {
        return 'Today';
    } else if (dateObj.toDateString() === tomorrow.toDateString()) {
        return 'Tomorrow';
    } else {
        return dateObj.toLocaleDateString(locale.value, {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        });
    }
};

const skeletonData = computed(() =>
    Array.from({ length: props.skeletonItems }, (_, index) => ({ id: index })),
);
</script>

<template>
    <div class="location-data-list">
        <!-- Loading skeletons -->
        <div v-if="loading" class="space-y-4">
            <div
                v-for="item in skeletonData"
                :key="item.id"
                class="flex gap-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div class="flex-shrink-0">
                    <Skeleton class="!h-32 !w-32 !rounded-xl" />
                </div>
                <div class="flex-1 space-y-3">
                    <Skeleton class="!h-6 !w-2/3" />
                    <Skeleton class="!h-4 !w-1/2" />
                    <Skeleton class="!h-16 !w-full" />
                    <div class="flex gap-2">
                        <Skeleton class="!h-6 !w-20" />
                        <Skeleton class="!h-6 !w-16" />
                        <Skeleton class="!h-6 !w-24" />
                    </div>
                </div>
                <div class="flex-shrink-0 space-y-2">
                    <Skeleton class="!h-4 !w-24" />
                    <Skeleton class="!h-4 !w-20" />
                    <Skeleton class="!h-4 !w-16" />
                </div>
            </div>
        </div>

        <!-- Empty state -->
        <div
            v-else-if="!locations.length"
            class="flex flex-col items-center justify-center py-16 text-center">
            <FontAwesomeIcon :icon="faLocationDot" class="mb-4 text-6xl text-gray-300" />
            <h3 class="mb-2 text-xl font-semibold text-gray-900">{{ emptyMessage }}</h3>
            <p class="text-gray-500">No locations match your current filters.</p>
        </div>

        <!-- Location items -->
        <div v-else class="space-y-4">
            <div
                v-for="location in locations"
                :key="location.id"
                class="group flex cursor-pointer gap-6 rounded-lg border-2 border-slate-200 bg-white p-4"
                @click="handleLocationClick(location)">
                <!-- Location Image -->
                <div class="flex-shrink-0">
                    <div class="relative h-32 w-32 overflow-hidden rounded-xl">
                        <img
                            :src="getLocationImageUrl(location)"
                            :alt="location.name"
                            class="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105" />
                    </div>
                </div>

                <!-- Main Content -->
                <div class="min-w-0 flex-1">
                    <!-- Header with name and badges -->
                    <div class="mb-3 flex items-start justify-between">
                        <h3
                            class="text-xl font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                            {{ location.name }}
                        </h3>
                        <p class="text-sm text-gray-500">
                            {{ location.street }} {{ location.number }}, {{ location.zip }}
                            {{ location.city }}
                        </p>
                    </div>

                    <!-- Description -->
                    <p class="mb-4 line-clamp-2 text-sm text-gray-700">
                        {{ location.description?.[locale] || location.excerpt?.[locale] }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.location {
}
</style>
