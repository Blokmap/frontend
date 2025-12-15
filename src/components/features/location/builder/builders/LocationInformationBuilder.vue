<script setup lang="ts">
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import LocationBuilderCard from '@/components/features/location/builder/LocationBuilderCard.vue';
import LocationMap from '@/components/features/map/LocationMap.vue';
import Callout from '@/components/shared/molecules/Callout.vue';
import LanguageSelector from '@/components/shared/molecules/LanguageSelector.vue';
import EditorInput from '@/components/shared/molecules/editor/EditorInput.vue';
import InputHint from '@/components/shared/molecules/form/InputHint.vue';
import InputLabel from '@/components/shared/molecules/form/InputLabel.vue';
import {
    faEdit,
    faHome,
    faSpinner,
    faExclamationTriangle,
    faCheckCircle,
    faChevronCircleRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useGeocodeAddress } from '@/composables/data/useGeoCoding';
import { useToast } from '@/composables/store/useToast';
import { getOutputDataLength } from '@/domain/editor/editorHelpers';
import { LOCATION_SETTINGS, formatLocationAddress } from '@/domain/location';
import { DEFAULT_MAP_OPTIONS } from '@/domain/map';
import type { LocationRequest } from '@/domain/location';
import type { LngLat } from '@/domain/map';

const form = defineModel<LocationRequest>({ required: true });

const toast = useToast();

const { locale } = useI18n();
const { mutateAsync: geocodeAddress, isPending: isPendingCoordinates } = useGeocodeAddress({
    disableToasts: true,
});

const mapZoom = ref<number>(18);
const currentLanguage = ref(locale.value);
const calculatedCoordinates = ref<LngLat | null>(null);

const mapCenter = computed<LngLat>({
    get() {
        const { longitude, latitude } = form.value;
        if (longitude && latitude) {
            return [longitude, latitude];
        }
        return DEFAULT_MAP_OPTIONS.center;
    },
    set([lng, lat]: LngLat) {
        form.value.longitude = Number(lng.toFixed(6));
        form.value.latitude = Number(lat.toFixed(6));
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
    const threshold = 0.00001;

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

// Clear calculated coordinates when address changes
watch(
    () => [form.value.street, form.value.number, form.value.zip, form.value.city],
    () => {
        calculatedCoordinates.value = null;
    },
);

/**
 * Calculate coordinates based on the entered address
 * and update the map center and zoom.
 */
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

/**
 * Reset the map center and zoom to the last calculated coordinates
 */
function resetToCalculatedCoordinates(): void {
    if (calculatedCoordinates.value) {
        mapCenter.value = calculatedCoordinates.value;
        mapZoom.value = 18;
    }
}
</script>

<template>
    <div class="space-y-8">
        <LocationBuilderCard :icon="faEdit">
            <template #header>
                <div class="flex w-full items-center justify-between">
                    <div>
                        <h3 class="text-xl font-semibold text-gray-900">Naam en beschrijving</h3>
                        <p class="text-sm text-gray-600">Voer de basisgegevens van uw locatie in</p>
                    </div>
                    <div class="flex items-center space-x-2">
                        <LanguageSelector v-model="currentLanguage">
                            <template #button="{ toggle, currentFlag, currentLabel }">
                                <Button severity="contrast" size="small" @click="toggle">
                                    <img :src="currentFlag" alt="flag" class="h-4 w-4" />
                                    <span class="text-sm">{{ currentLabel }}</span>
                                </Button>
                            </template>
                        </LanguageSelector>
                    </div>
                </div>
            </template>
            <template #default>
                <div>
                    <InputLabel htmlFor="name"> Locatie naam * </InputLabel>
                    <InputText id="name" v-model="form.name" class="w-full" placeholder="De Krook">
                    </InputText>
                    <InputHint> Kies een herkenbare naam voor de locatie </InputHint>
                </div>

                <!-- Short description (current language) -->
                <div>
                    <InputLabel :htmlFor="`excerpt-${currentLanguage}`">
                        Korte omschrijving ({{ currentLanguage }})
                    </InputLabel>
                    <InputText
                        :id="`excerpt-${currentLanguage}`"
                        :maxlength="LOCATION_SETTINGS.MAX_EXCERPT_LENGTH"
                        v-model="form.excerpt![currentLanguage]"
                        class="w-full"
                        placeholder="Stadsbibliotheek met zicht op het water">
                    </InputText>
                    <InputHint>
                        <div class="flex justify-between">
                            <span class="text-gray-500">
                                Omschrijf de locatie in maximaal 6 beschrijvende woorden
                            </span>
                            <span class="text-gray-500">
                                {{ (form.excerpt?.[currentLanguage] || '').length }}/{{
                                    LOCATION_SETTINGS.MAX_EXCERPT_LENGTH
                                }}
                                karakters
                            </span>
                        </div>
                    </InputHint>
                </div>

                <!-- Detailed Description -->
                <!-- Current language description -->
                <div>
                    <InputLabel :htmlFor="`description-${currentLanguage}`">
                        Uitgebreide Beschrijving ({{ currentLanguage }})
                    </InputLabel>
                    <EditorInput
                        :id="`description-${currentLanguage}`"
                        :max-length="LOCATION_SETTINGS.MAX_DESCRIPTION_LENGTH"
                        v-model="form.description![currentLanguage]">
                    </EditorInput>
                    <InputHint>
                        {{ getOutputDataLength(form.description?.[currentLanguage] || '') }}/{{
                            LOCATION_SETTINGS.MAX_DESCRIPTION_LENGTH
                        }}
                        karakters
                    </InputHint>
                </div>
            </template>
        </LocationBuilderCard>

        <LocationBuilderCard :icon="faHome">
            <template #header>
                <h3 class="text-xl font-semibold text-gray-900">Adres en locatie op kaart</h3>
                <p class="text-sm text-gray-600">
                    Voer het adres van uw locatie in op de kaart. Sleep de kaart om de locatie
                    marker precies te positioneren.
                </p>
            </template>
            <template #default>
                <div class="relative">
                    <!-- Address Input Overlay -->
                    <div class="address-overlay">
                        <div class="address-wrapper">
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
                                    <span>Sleep de marker om de positie te verfijnen.</span>
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

                    <!-- Map -->
                    <LocationMap
                        class="aspect-video h-full w-full rounded-lg"
                        ref="map-container"
                        v-model:center="mapCenter"
                        v-model:zoom="mapZoom">
                    </LocationMap>
                </div>
            </template>
        </LocationBuilderCard>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.address-overlay {
    @apply z-10 mb-3 w-full;
    @apply sm:absolute sm:top-3 sm:left-3 sm:mb-0 sm:w-64;

    .address-wrapper {
        @apply space-y-3 rounded-lg bg-white;
        @apply sm:space-y-3 sm:p-3;
    }
}

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
