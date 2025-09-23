<script lang="ts" setup>
import Button from 'primevue/button';
import Menu from 'primevue/menu';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useTemplateRef } from 'vue';
import { useI18n } from 'vue-i18n';
import {
    formatLocationAddress,
    getLocationPlaceholderImage,
    getLocationStatus,
} from '@/domain/location';
import LocationLanguagesList from './details/LocationLanguagesList.vue';
import LocationStatusBadge from './details/LocationStatusBadge.vue';
import type { Location } from '@/domain/location';

const props = defineProps<{
    location: Location;
}>();

const emit = defineEmits<{
    click: [location: Location];
    'click:approve': [location: Location];
    'click:reject': [location: Location];
}>();

const { locale } = useI18n();

const menu = useTemplateRef('menu');

const getLocationImageUrl = (location: Location) => {
    const [image] = location.images || [];
    if (image) return image.url;
    return getLocationPlaceholderImage(location);
};

const onClick = () => {
    emit('click', props.location);
};

// const onApproveClick = (event: Event) => {
//     event.stopPropagation();
//     emit('click:approve', props.location);
// };

// const onRejectClick = (event: Event) => {
//     event.stopPropagation();
//     emit('click:reject', props.location);
// };

const onToggleActionMenu = (event: Event) => {
    event.stopPropagation();
    console.log('Toggling menu', menu.value);
    menu.value?.toggle(event);
};
</script>

<template>
    <div class="location-card" @click="onClick">
        <!-- Location Image -->
        <div class="flex-shrink-0">
            <div class="location-image-container">
                <img
                    :src="getLocationImageUrl(location)"
                    :alt="location.name"
                    class="location-image" />
            </div>
        </div>

        <!-- Main Content -->
        <div class="min-w-0 flex-1 space-y-3">
            <!-- Header with name and address -->
            <div class="flex w-full items-center justify-between gap-3">
                <h3 class="location-title">
                    {{ location.name }}
                </h3>
                <LocationStatusBadge :status="getLocationStatus(location)" />
            </div>

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
        <div
            class="flex items-center justify-center border-l border-slate-100 ps-4"
            @click="onToggleActionMenu">
            <Button
                severity="contrast"
                aria-haspopup="true"
                :aria-controls="`location-actions-${location.id}`"
                text>
                <template #icon>
                    <FontAwesomeIcon :icon="faEllipsisH" />
                </template>
            </Button>
            <Menu ref="menu" :id="`location-actions-${location.id}`"> Hellaur </Menu>
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.location-card {
    @apply flex cursor-pointer gap-6 rounded-lg border border-slate-200 bg-white p-4;

    .location-image-container {
        @apply relative h-32 w-32 overflow-hidden rounded-xl;

        .location-image {
            @apply h-full w-full object-cover transition-transform duration-200;
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
