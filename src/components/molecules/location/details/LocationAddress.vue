<script lang="ts" setup>
import Button from 'primevue/button';
import Skeleton from 'primevue/skeleton';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';
import googleMapsLogo from '@/assets/img/logos/google-maps-logo.svg';
import { formatLocationAddress, getGoogleMapsDirectionsLink } from '@/domain/location';
import type { Location } from '@/domain/location';

const props = defineProps<{
    location?: Location;
    loading?: boolean;
}>();

const googleMapsLink = computed(() =>
    props.location ? getGoogleMapsDirectionsLink(props.location) : '',
);
</script>

<template>
    <div v-if="loading" class="location-address location-address--loading">
        <Skeleton height="88px" width="100%" class="rounded-xl" />
    </div>

    <div v-else-if="location" class="location-address">
        <div class="location-address__content">
            <div class="location-address__icon-wrapper">
                <FontAwesomeIcon :icon="faLocationDot" class="location-address__icon" />
            </div>
            <div class="location-address__info">
                <h3 class="location-address__title">Adres</h3>
                <p class="location-address__text">
                    {{ formatLocationAddress(location) }}
                </p>
            </div>
        </div>

        <a :href="googleMapsLink" target="_blank" rel="noopener" class="location-address__link">
            <Button severity="contrast">
                <img :src="googleMapsLogo" alt="Google Maps Logo" class="location-address__logo" />
                <span class="whitespace-nowrap">Open in Google Maps</span>
            </Button>
        </a>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.location-address {
    @apply flex flex-col gap-4;
    @apply sm:flex-row sm:items-center sm:gap-3;
}

.location-address__content {
    @apply flex flex-1 items-center gap-3;
}

.location-address__icon-wrapper {
    @apply bg-primary text-primary-contrast;
    @apply flex h-10 w-10 shrink-0 items-center justify-center rounded-lg;
}

.location-address__icon {
    @apply text-primary-contrast h-5 w-5;
}

.location-address__info {
    @apply min-w-0 flex-1;
}

.location-address__title {
    @apply font-semibold text-gray-900;
}

.location-address__text {
    @apply text-sm break-words text-gray-600;
    @apply sm:text-base;
}

.location-address__logo {
    @apply h-5 w-5;
}
</style>
