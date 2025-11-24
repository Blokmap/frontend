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
    <div v-if="loading" class="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-3">
        <Skeleton height="88px" width="100%" class="rounded-xl" />
    </div>

    <div v-else-if="location" class="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-3">
        <div class="flex flex-1 items-center gap-3">
            <div
                class="bg-primary-100 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                <FontAwesomeIcon :icon="faLocationDot" class="text-primary-600 h-5 w-5" />
            </div>
            <div class="min-w-0 flex-1">
                <h3 class="font-semibold text-gray-900">Adres</h3>
                <p class="text-sm break-words text-gray-600 sm:text-base">
                    {{ formatLocationAddress(location) }}
                </p>
            </div>
        </div>

        <a :href="googleMapsLink" target="_blank" rel="noopener">
            <Button severity="contrast">
                <img :src="googleMapsLogo" alt="Google Maps Logo" class="h-5 w-5" />
                <span class="whitespace-nowrap">Open in Google Maps</span>
            </Button>
        </a>
    </div>
</template>
