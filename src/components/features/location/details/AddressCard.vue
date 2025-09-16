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
    <div class="rounded-xl border border-slate-200 bg-white p-6">
        <div class="flex items-center gap-3">
            <div class="bg-primary-100 flex h-10 w-10 items-center justify-center rounded-lg">
                <FontAwesomeIcon :icon="faLocationDot" class="text-primary-600 h-5 w-5" />
            </div>
            <div class="flex-1">
                <h3 class="font-semibold text-gray-900">Adres</h3>
                <p class="text-gray-600">
                    {{ formatLocationAddress(location) }}
                </p>
            </div>

            <a
                :href="googleMapsLink"
                class="flex items-center gap-1"
                target="_blank"
                rel="noopener">
                <img :src="googleMapsLogo" alt="Google Maps Logo" class="h-5 w-5" />
                Open in Google Maps
            </a>
        </div>
    </div>
</template>
