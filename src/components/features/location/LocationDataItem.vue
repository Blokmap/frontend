<script lang="ts" setup>
import Badge from 'primevue/badge';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useI18n } from 'vue-i18n';
import { formatLocationAddress, getLocationPlaceholderImage } from '@/domain/location';
import LocationActionsMenu from './LocationActionsMenu.vue';
import LocationLanguagesList from './details/LocationLanguagesList.vue';
import LocationStateBadge from './details/LocationStateBadge.vue';
import type { Location, LocationState } from '@/domain/location';

const props = defineProps<{
    location: Location;
    actionIsPending?: boolean;
}>();

const emit = defineEmits<{
    click: [location: Location];
    'change:state': [locationId: number, status: LocationState];
}>();

const { locale } = useI18n();

const getLocationImageUrl = (location: Location) => {
    const [image] = location.images || [];
    if (image) return image.url;
    return getLocationPlaceholderImage(location);
};

const onClick = () => {
    emit('click', props.location);
};

const onStatusChange = (locationId: number, status: LocationState) => {
    emit('change:state', locationId, status);
};
</script>

<template>
    <div class="location-card" @click="onClick">
        <!-- Location Image -->
        <div class="location-image-container">
            <img :src="getLocationImageUrl(location)" :alt="location.name" class="location-image" />
        </div>

        <!-- Main Content -->
        <div class="min-w-0 flex-1 space-y-3">
            <!-- Header with name and address -->
            <div class="flex w-full items-center justify-between gap-3">
                <h3 class="location-title">
                    {{ location.name }}
                </h3>
                <LocationStateBadge :location="location" />
            </div>

            <Badge severity="contrast" class="inline-flex gap-2" v-if="location.createdBy">
                <FontAwesomeIcon :icon="faUser" />
                <span>
                    {{ location.createdBy?.firstName }}
                </span>
                <FontAwesomeIcon :icon="faArrowRight" />
            </Badge>

            <LocationLanguagesList :location="location" />

            <p class="location-address">
                {{ formatLocationAddress(location) }}
            </p>

            <!-- Description -->
            <p class="location-description">
                {{ location.description?.[locale] || location.excerpt?.[locale] }}
            </p>
        </div>

        <!-- Action Button -->
        <div class="flex items-center justify-center border-l border-slate-100 ps-4">
            <LocationActionsMenu
                :location="location"
                :is-pending="actionIsPending"
                @change:status="onStatusChange">
            </LocationActionsMenu>
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.location-card {
    @apply flex cursor-pointer items-center gap-6 p-4;
    @apply rounded-lg border border-slate-200 bg-white;

    .location-image-container {
        @apply relative aspect-square max-h-[175px] flex-shrink-0 overflow-hidden rounded-xl;

        .location-image {
            @apply h-full w-full object-cover;
        }
    }

    .location-title {
        @apply text-xl font-semibold text-gray-900 transition-colors;
    }

    .location-address {
        @apply text-sm text-gray-500;
    }

    .location-description {
        @apply text-sm text-gray-700;
    }
}
</style>
