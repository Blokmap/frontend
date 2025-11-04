<script lang="ts" setup>
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';
import googleMapsLogo from '@/assets/img/logos/google-maps-logo.svg';
import { formatLocationAddress, getGoogleMapsDirectionsLink } from '@/domain/location';
import type { Location } from '@/domain/location';

const props = defineProps<{
    location: Location;
}>();

const googleMapsLink = computed(() => getGoogleMapsDirectionsLink(props.location));
</script>

<template>
    <div class="rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-3">
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

            <a
                :href="googleMapsLink"
                class="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-slate-50 sm:shrink-0"
                target="_blank"
                rel="noopener">
                <img :src="googleMapsLogo" alt="Google Maps Logo" class="h-5 w-5" />
                <span class="whitespace-nowrap">Open in Google Maps</span>
            </a>
        </div>
    </div>
</template>
