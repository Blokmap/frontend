<script setup lang="ts">
import LanguageSelector from '@/components/features/layout/LanguageSelector.vue';
import LocationSubmitCard from '@/components/features/location/submit/LocationSubmitCard.vue';
import AddressMap from '@/components/features/map/AddressMap.vue';
import { useForwardGeoSearch } from '@/composables/data/useGeoCoding';
import { useToast } from '@/composables/useToast';
import type { SubStep } from '@/types/contract/LocationWizard';
import type { LngLat } from '@/types/contract/Map';
import type { CreateLocationRequest } from '@/types/schema/Location';
import { formatLocationAddress } from '@/utils/schema/location';
import { faCheck, faEdit, faHome, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import { computed, ref, useTemplateRef, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';

const form = defineModel<CreateLocationRequest>({ required: true });
const complete = defineModel<boolean>('complete', { default: false });
const substeps = defineModel<SubStep[]>('substeps', { default: [] });

const toast = useToast();

const { locale } = useI18n();
const { mutateAsync: geocodeAddress, isPending: isLoading } = useForwardGeoSearch();

const mapContainer = useTemplateRef('map-container');
const currentLanguage = ref(locale.value);

const mapZoom = ref<number>(18);

const mapCenter = computed<LngLat>({
    get() {
        return [form.value.longitude, form.value.latitude];
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
        data.number &&
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
            isCompleted:
                !!data.street &&
                !!data.number &&
                !!data.zip &&
                !!data.city &&
                !!hasCoordinates.value,
        },
    ];
});

async function handleConfirmAddress(): Promise<void> {
    if (!canConfirmAddress.value) return;
    if (!mapContainer.value) return;

    try {
        const address = formatLocationAddress(form.value);
        mapCenter.value = await geocodeAddress(address);
        mapZoom.value = 18;
        mapContainer.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
        <LocationSubmitCard :icon="faEdit">
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
                    <InputText
                        id="name"
                        v-model="form.name"
                        class="w-full"
                        placeholder="Bijv. Brugs Beertje, Café Central..." />
                    <small class="mt-1 block text-gray-500">
                        Kies een herkenbare naam voor de locatie
                    </small>
                </div>

                <!-- Short description (current language) -->
                <div>
                    <label
                        :for="`excerpt-${currentLanguage}`"
                        class="mb-2 block text-sm font-medium text-gray-700">
                        Korte beschrijving ({{ currentLanguage }})
                    </label>
                    <Textarea
                        rows="3"
                        class="w-full"
                        placeholder="Bijv. Gezellig café met lokale bieren"
                        :id="`excerpt-${currentLanguage}`"
                        :maxlength="100"
                        v-model="form.excerpt![currentLanguage]">
                    </Textarea>
                    <small class="mt-1 block text-gray-500">
                        {{ (form.excerpt?.[currentLanguage] || '').length }}/100 karakters
                    </small>
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
                            :maxlength="500"
                            rows="5"
                            placeholder="Bijv. Gezellige café met lokale bieren">
                        </Textarea>
                        <small class="mt-1 block text-gray-500">
                            {{ (form.description?.[currentLanguage] || '').length }}/500 karakters
                        </small>
                    </div>
                </div>
            </template>
        </LocationSubmitCard>

        <LocationSubmitCard :icon="faHome">
            <template #header>
                <h3 class="text-xl font-semibold text-gray-900">Adres informatie</h3>
                <p class="text-sm text-gray-600">Voer het adres van uw locatie in</p>
            </template>
            <template #default>
                <!-- Manual Address Entry -->
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label for="street" class="mb-2 block text-sm font-medium text-gray-700">
                            Straatnaam *
                        </label>
                        <InputText
                            id="street"
                            v-model="form.street"
                            class="w-full"
                            placeholder="Bijv. Nieuwstraat">
                        </InputText>
                    </div>

                    <div>
                        <label for="number" class="mb-2 block text-sm font-medium text-gray-700">
                            Huisnummer *
                        </label>
                        <InputText
                            id="number"
                            v-model="form.number"
                            class="w-full"
                            placeholder="Bijv. 46">
                        </InputText>
                    </div>

                    <div>
                        <label for="zip" class="mb-2 block text-sm font-medium text-gray-700">
                            Postcode *
                        </label>
                        <InputText
                            id="zip"
                            v-model="form.zip"
                            class="w-full"
                            placeholder="Bijv. 8610">
                        </InputText>
                    </div>

                    <div>
                        <label for="city" class="mb-2 block text-sm font-medium text-gray-700">
                            Stad *
                        </label>
                        <InputText
                            id="city"
                            v-model="form.city"
                            class="w-full"
                            placeholder="Bijv. Kortemark">
                        </InputText>
                    </div>
                </div>

                <!-- Address Confirmation Button -->
                <div
                    class="flex items-center justify-between rounded-lg border-1 border-slate-200 bg-gray-50 p-4">
                    <div>
                        <h4 class="font-medium text-gray-900">Bevestig locatie op kaart</h4>
                        <p class="text-sm text-gray-600">
                            Controleer en bevestig de exacte locatie op de kaart
                        </p>
                        <div v-if="hasCoordinates" class="text-primary-600 mt-1 text-xs">
                            <FontAwesomeIcon :icon="faCheck" />
                            Bevestigd:
                            {{ form.latitude?.toFixed(6) }},
                            {{ form.longitude?.toFixed(6) }}
                        </div>
                    </div>
                    <Button
                        @click="handleConfirmAddress"
                        :disabled="!canConfirmAddress"
                        :loading="isLoading"
                        :outlined="!hasCoordinates">
                        <FontAwesomeIcon :icon="faMapMarkerAlt" class="mr-2" />
                        Bevestig op kaart
                    </Button>
                </div>
                <div class="map-container" ref="map-container">
                    <AddressMap v-model:center="mapCenter" v-model:zoom="mapZoom"> </AddressMap>
                </div>
            </template>
        </LocationSubmitCard>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.map-container {
    @apply h-[400px] w-full rounded-md border-2 border-slate-200;
}
</style>
