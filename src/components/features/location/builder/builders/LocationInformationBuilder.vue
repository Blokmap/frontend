<script setup lang="ts">
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import LocationBuilderCard from '@/components/features/location/builder/LocationBuilderCard.vue';
import LocationMap from '@/components/features/map/LocationMap.vue';
import Callout from '@/components/shared/molecules/Callout.vue';
import LanguageSelector from '@/components/shared/molecules/LanguageSelector.vue';
import {
    faEdit,
    faHome,
    faSpinner,
    faExclamationTriangle,
    faCheckCircle,
    faChevronCircleRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, ref, watch, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { useGeocodeAddress } from '@/composables/data/useGeoCoding';
import { useToast } from '@/composables/store/useToast';
import { LOCATION_SETTINGS, formatLocationAddress } from '@/domain/location';
import { defaultMapOptions } from '@/domain/map';
import type { BuilderSubstep } from '..';
import type { LocationRequest } from '@/domain/location';
import type { LngLat } from '@/domain/map';

const form = defineModel<LocationRequest>({ required: true });
const complete = defineModel<boolean>('complete', { default: false });
const substeps = defineModel<BuilderSubstep[]>('substeps', { default: [] });

const toast = useToast();

const { locale } = useI18n();
const { mutateAsync: geocodeAddress, isPending: isPendingCoordinates } = useGeocodeAddress();

const mapZoom = ref<number>(18);
const currentLanguage = ref(locale.value);
const calculatedCoordinates = ref<LngLat | null>(null);

const mapCenter = computed<LngLat>({
    get() {
        const { longitude, latitude } = form.value;
        if (longitude && latitude) {
            return [longitude, latitude];
        }
        return defaultMapOptions.center;
    },
    set([lng, lat]: LngLat) {
        form.value.longitude = lng;
        form.value.latitude = lat;
    },
});

const canCalculateCoordinates = computed(() => {
    return !!(form.value.street && form.value.number && form.value.zip && form.value.city);
});

const hasCoordinates = computed(() => {
    return !!(form.value.latitude && form.value.longitude);
});

const hasManuallyAdjusted = computed(() => {
    if (!calculatedCoordinates.value || !hasCoordinates.value) return false;

    const [calcLng, calcLat] = calculatedCoordinates.value;
    const threshold = 0.00001; // ~1 meter precision

    return (
        Math.abs(form.value.longitude! - calcLng) > threshold ||
        Math.abs(form.value.latitude! - calcLat) > threshold
    );
});

const needsCoordinateCalculation = computed(() => {
    if (!canCalculateCoordinates.value) return false;

    // Need calculation if no coordinates at all
    if (!hasCoordinates.value) return true;

    // Need recalculation if address changed but coordinates weren't recalculated
    if (!calculatedCoordinates.value) return true;

    return false;
});

watchEffect(() => {
    const data = form.value;
    const ex = data.excerpt;
    const desc = data.description;

    complete.value = !!(
        data.name &&
        ex.nl &&
        desc.nl &&
        data.street &&
        data.zip &&
        data.city &&
        hasCoordinates.value
    );
});

watchEffect(() => {
    const data = form.value;
    const ex = data.excerpt;
    const desc = data.description;

    substeps.value = [
        {
            label: 'Naam en beschrijving',
            isCompleted: !!data.name && !!ex.nl && !!desc.nl,
        },
        {
            label: 'Locatie op kaart',
            isCompleted: !!data.street && !!data.zip && !!data.city && !!hasCoordinates.value,
        },
    ];
});

async function calculateCoordinates(): Promise<void> {
    if (!canCalculateCoordinates.value) return;

    try {
        const address = formatLocationAddress(form.value);
        const geocode = await geocodeAddress(address);

        calculatedCoordinates.value = geocode;
        mapZoom.value = 18;
        mapCenter.value = geocode;
    } catch {
        toast.add({
            severity: 'error',
            summary: 'Fout bij het ophalen van coördinaten',
            detail: 'Er is iets misgegaan bij het ophalen van de locatie. Controleer het adres en probeer het opnieuw.',
        });
    }
}

function resetToCalculatedCoordinates(): void {
    if (calculatedCoordinates.value) {
        mapCenter.value = calculatedCoordinates.value;
        mapZoom.value = 18;
    }
}

// Clear calculated coordinates when address changes
watch(
    () => [form.value.street, form.value.number, form.value.zip, form.value.city],
    () => {
        calculatedCoordinates.value = null;
    },
);
</script>

<template>
    <div class="space-y-8">
        <LocationBuilderCard :icon="faEdit">
            <template #header>
                <div class="flex w-full items-center justify-between">
                    <div>
                        <h3 class="text-xl font-semibold text-gray-900">Basis informatie</h3>
                        <p class="text-sm text-gray-600">Voer de basisgegevens van uw locatie in</p>
                    </div>
                    <div class="flex items-center space-x-2">
                        <LanguageSelector v-model="currentLanguage">
                            <template #button="{ toggle, currentFlag, currentLabel }">
                                <Button severity="contrast" size="small" @click="toggle">
                                    <img :src="currentFlag" alt="flag" class="mr-2 h-4 w-4" />
                                    <span class="text-sm">{{ currentLabel }}</span>
                                </Button>
                            </template>
                        </LanguageSelector>
                    </div>
                </div>
            </template>
            <template #default>
                <div>
                    <label for="name" class="mb-2 block text-sm font-medium text-gray-700">
                        Locatie naam *
                    </label>
                    <InputText id="name" v-model="form.name" class="w-full" placeholder="De Krook">
                    </InputText>
                    <small class="mt-1 block text-gray-500">
                        Kies een herkenbare naam voor de locatie
                    </small>
                </div>

                <!-- Short description (current language) -->
                <div>
                    <label
                        :for="`excerpt-${currentLanguage}`"
                        class="mb-2 block text-sm font-medium text-gray-700">
                        Korte omschrijving ({{ currentLanguage }})
                    </label>
                    <InputText
                        :id="`excerpt-${currentLanguage}`"
                        v-model="form.excerpt![currentLanguage]"
                        class="w-full"
                        placeholder="Stadsbibliotheek met zicht op het water"
                        :maxlength="LOCATION_SETTINGS.MAX_EXCERPT_LENGTH">
                    </InputText>
                    <div class="mt-1 flex justify-between">
                        <small class="text-gray-500">
                            Omschrijf de locatie in maximaal 6 beschrijvende woorden
                        </small>
                        <small class="text-gray-500">
                            {{ (form.excerpt?.[currentLanguage] || '').length }}/{{
                                LOCATION_SETTINGS.MAX_EXCERPT_LENGTH
                            }}
                            karakters
                        </small>
                    </div>
                </div>

                <!-- Detailed Description -->
                <div class="border-t border-gray-200 pt-6">
                    <h4 class="mb-4 text-lg font-medium text-gray-900">Uitgebreide beschrijving</h4>

                    <!-- Current language description -->
                    <div>
                        <label
                            :for="`description-${currentLanguage}`"
                            class="mb-2 block text-sm font-medium text-gray-700">
                            Beschrijving ({{ currentLanguage }})
                        </label>
                        <Textarea
                            :id="`description-${currentLanguage}`"
                            v-model="form.description![currentLanguage]"
                            class="w-full"
                            :maxlength="LOCATION_SETTINGS.MAX_DESCRIPTION_LENGTH"
                            rows="5"
                            placeholder="De Krook is de stadsbibliotheek van Gent, de ideale plek om rustig te studeren tussen andere studenten, met zicht op de Leie.">
                        </Textarea>
                        <small class="mt-1 block text-gray-500">
                            {{ (form.description?.[currentLanguage] || '').length }}/{{
                                LOCATION_SETTINGS.MAX_DESCRIPTION_LENGTH
                            }}
                            karakters
                        </small>
                    </div>
                </div>
            </template>
        </LocationBuilderCard>

        <LocationBuilderCard :icon="faHome">
            <template #header>
                <h3 class="text-xl font-semibold text-gray-900">Adres informatie</h3>
                <p class="text-sm text-gray-600">
                    Voer het adres van uw locatie in op de kaart. Sleep de kaart om de locatie
                    marker precies te positioneren.
                </p>
            </template>
            <template #default>
                <!-- Map with overlay address input -->
                <div class="relative">
                    <LocationMap
                        class="aspect-video h-full w-full rounded-lg"
                        ref="map-container"
                        v-model:center="mapCenter"
                        v-model:zoom="mapZoom">
                    </LocationMap>

                    <!-- Address Input Overlay -->
                    <div class="absolute top-3 left-3 z-10 w-64">
                        <div class="space-y-3 rounded-lg bg-white p-3 shadow-xs">
                            <div class="flex items-center justify-between">
                                <h4 class="text-sm font-medium text-gray-900">Adres</h4>
                            </div>

                            <!-- Compact address input -->
                            <div class="space-y-2">
                                <div class="flex overflow-hidden rounded-md bg-gray-50">
                                    <InputText
                                        v-model="form.street"
                                        placeholder="Straat"
                                        class="address-input"
                                        :disabled="isPendingCoordinates">
                                    </InputText>
                                    <InputText
                                        v-model="form.number"
                                        placeholder="Nr"
                                        class="address-input"
                                        :disabled="isPendingCoordinates">
                                    </InputText>
                                </div>

                                <div class="flex overflow-hidden rounded-md bg-gray-50">
                                    <InputText
                                        v-model="form.zip"
                                        placeholder="Postcode"
                                        class="address-input"
                                        :disabled="isPendingCoordinates">
                                    </InputText>
                                    <InputText
                                        v-model="form.city"
                                        placeholder="Stad"
                                        class="address-input"
                                        :disabled="isPendingCoordinates">
                                    </InputText>
                                </div>
                            </div>

                            <!-- Status indicator -->
                            <div
                                v-if="isPendingCoordinates"
                                class="flex items-center space-x-2 text-xs text-gray-600">
                                <FontAwesomeIcon :icon="faSpinner" spin class="h-3 w-3" />
                                <span>Coördinaten berekenen...</span>
                            </div>
                            <div v-else-if="needsCoordinateCalculation" class="space-y-2">
                                <Button
                                    size="small"
                                    class="w-full"
                                    @click="calculateCoordinates"
                                    :disabled="!canCalculateCoordinates">
                                    <FontAwesomeIcon
                                        :icon="faExclamationTriangle"
                                        class="mr-2 h-3 w-3">
                                    </FontAwesomeIcon>
                                    <span>Bereken coördinaten</span>
                                </Button>
                                <p class="text-xs text-gray-500">
                                    Klik om de locatie op de kaart te tonen
                                </p>
                            </div>
                            <Callout
                                v-else-if="hasCoordinates && hasManuallyAdjusted"
                                :show-icon="false"
                                @click="resetToCalculatedCoordinates">
                                <div class="flex cursor-pointer items-center gap-2 text-xs">
                                    <span>
                                        Locatie werd verfijnd op de kaart. Klik hier om te resetten.
                                    </span>
                                    <FontAwesomeIcon :icon="faChevronCircleRight" />
                                </div>
                            </Callout>
                            <Callout
                                v-else-if="hasCoordinates && !hasManuallyAdjusted"
                                :show-icon="false">
                                <div class="flex items-center gap-2 text-xs">
                                    <span> Sleep de marker om de positie te verfijnen. </span>
                                    <FontAwesomeIcon :icon="faCheckCircle" />
                                </div>
                            </Callout>

                            <!-- Coordinates display -->
                            <div v-if="hasCoordinates" class="text-center">
                                <p class="font-mono text-[10px] text-gray-400">
                                    {{ form.latitude?.toFixed(6) }},
                                    {{ form.longitude?.toFixed(6) }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </LocationBuilderCard>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.address-input {
    @apply w-full border-0 bg-transparent px-3 py-2 text-sm shadow-none;

    &:first-child {
        @apply rounded-r-none border-r border-gray-200;
    }

    &:last-child {
        @apply rounded-l-none;
    }
}
</style>
