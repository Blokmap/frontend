<script setup lang="ts">
import LanguageSelector from '@/components/features/layout/LanguageSelector.vue';
import LocationBuilderCard from '@/components/features/location/builder/LocationBuilderCard.vue';
import AddressMap from '@/components/features/map/AddressMap.vue';
import Callout from '@/components/shared/Callout.vue';
import { useForwardGeoSearch } from '@/composables/data/useGeoCoding';
import { useToast } from '@/composables/store/useToast';
import { LOCATION_SETTINGS } from '@/domain/location';
import type { BuilderSubstep, LocationRequest } from '@/domain/location';
import { formatLocationAddress } from '@/domain/location';
import type { LngLat } from '@/domain/map';
import { defaultMapOptions } from '@/domain/map';
import { faEdit, faHome, faInfoCircle, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import Textarea from 'primevue/textarea';
import { computed, nextTick, ref, useTemplateRef, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';

const form = defineModel<LocationRequest>({ required: true });
const complete = defineModel<boolean>('complete', { default: false });
const substeps = defineModel<BuilderSubstep[]>('substeps', { default: [] });

const toast = useToast();

const { locale } = useI18n();
const { mutateAsync: geocodeAddress, isPending: isLoading } = useForwardGeoSearch();

const mapContainer = useTemplateRef('map-container');
const currentLanguage = ref(locale.value);
const mapZoom = ref<number>(18);

const mapCenter = computed<LngLat>({
    get() {
        if (form.value.longitude && form.value.latitude) {
            return [form.value.longitude, form.value.latitude];
        }
        return defaultMapOptions.center;
    },
    set([lng, lat]: LngLat) {
        form.value.longitude = lng;
        form.value.latitude = lat;
    },
});

const canConfirmAddress = computed(() => {
    return !!(form.value.street && form.value.number && form.value.zip && form.value.city);
});

const hasCoordinates = computed(() => {
    return !!(form.value.latitude && form.value.longitude);
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

async function handleConfirmAddress(): Promise<void> {
    if (!canConfirmAddress.value) return;

    try {
        const address = formatLocationAddress(form.value);

        mapCenter.value = await geocodeAddress(address);
        mapZoom.value = 18;

        await nextTick();

        mapContainer.value?.$el.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Fout bij het ophalen van coördinaten',
            detail: 'Er is iets misgegaan bij het ophalen van de locatie. Controleer het adres en probeer het opnieuw.',
        });
    }
}
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
                                <Button @click="toggle" severity="contrast" size="small">
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
                        class="w-full"
                        placeholder="Stadsbibliotheek met zicht op het water"
                        :id="`excerpt-${currentLanguage}`"
                        :maxlength="LOCATION_SETTINGS.MAX_EXCERPT_LENGTH"
                        v-model="form.excerpt![currentLanguage]">
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
                <p class="text-sm text-gray-600">Voer het adres van uw locatie in op de kaart</p>
            </template>
            <template #default>
                <!-- Info callout -->
                <Callout>
                    Sleep de kaart om de locatie marker precies te positioneren. De marker toont de
                    exacte locatie die zal worden opgeslagen.
                </Callout>

                <!-- Map with overlay address input -->
                <div class="relative">
                    <AddressMap
                        class="aspect-video h-full w-full rounded-lg"
                        ref="map-container"
                        v-model:center="mapCenter"
                        v-model:zoom="mapZoom">
                    </AddressMap>

                    <!-- Address Input Overlay -->
                    <div class="absolute top-3 left-3 z-10 w-64">
                        <div class="rounded-lg bg-white p-3 shadow-xs">
                            <h4 class="mb-3 text-sm font-medium text-gray-900">Adres</h4>

                            <!-- Compact address input -->
                            <div class="mb-3 space-y-2">
                                <div class="flex overflow-hidden rounded-md bg-gray-50">
                                    <InputText
                                        v-model="form.street"
                                        placeholder="Straat"
                                        class="address-input"
                                        @keyup.enter="handleConfirmAddress">
                                    </InputText>
                                    <InputText
                                        v-model="form.number"
                                        placeholder="Nr"
                                        class="address-input"
                                        @keyup.enter="handleConfirmAddress">
                                    </InputText>
                                </div>

                                <div class="flex overflow-hidden rounded-md bg-gray-50">
                                    <InputText
                                        v-model="form.zip"
                                        placeholder="Postcode"
                                        class="address-input"
                                        @keyup.enter="handleConfirmAddress">
                                    </InputText>
                                    <InputText
                                        v-model="form.city"
                                        placeholder="Stad"
                                        class="address-input"
                                        @keyup.enter="handleConfirmAddress">
                                    </InputText>
                                </div>
                            </div>

                            <!-- Action button -->
                            <Button
                                @click="handleConfirmAddress"
                                :disabled="!canConfirmAddress"
                                :loading="isLoading"
                                class="w-full"
                                size="small">
                                <FontAwesomeIcon :icon="faMapMarkerAlt" class="mr-1" />
                                <span>Vlieg naar coordinaten</span>
                            </Button>
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
