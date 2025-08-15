<script setup lang="ts">
import AddressMap from '../../map/AddressMap.vue';
import LanguageSelector from '@/components/features/layout/LanguageSelector.vue';
import { useForwardGeoSearch } from '@/composables/data/useGeoCoding';
import { useToast } from '@/composables/useToast';
import type { LngLat } from '@/types/contract/Map';
import type { CreateLocationRequest } from '@/types/schema/Location';
import { faEdit, faHome, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Button from 'primevue/button';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import { computed, nextTick, ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';

const form = defineModel<CreateLocationRequest>({ required: true });
const complete = defineModel<boolean>('complete', { default: false });

const toast = useToast();

const { locale } = useI18n();
const { mutateAsync: geocodeAddress, isPending: isLoading } = useForwardGeoSearch();

const currentLanguage = ref(locale.value);
const showMapDialog = ref(false);

const mapCenter = computed<LngLat>({
    get() {
        return [form.value.longitude || 0, form.value.latitude || 0] as LngLat;
    },
    set([lng, lat]: LngLat) {
        form.value.longitude = lng;
        form.value.latitude = lat;
    },
});

const currentAddress = computed(() => {
    const { street, number, city } = form.value;

    if (street && number && city) {
        return `${street} ${number}, ${city}`;
    }

    return '';
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

const handleConfirmAddress = async () => {
    if (!canConfirmAddress.value) return;

    try {
        mapCenter.value = await geocodeAddress(currentAddress.value);
        showMapDialog.value = true;

        await nextTick();

        const mapContainer = document.getElementById('map-container');

        if (mapContainer) {
            mapContainer.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Fout bij het ophalen van coördinaten',
            detail: 'Er is iets misgegaan bij het ophalen van de locatie. Controleer het adres en probeer het opnieuw.',
        });
    }
};
</script>

<template>
    <div class="space-y-6">
        <!-- Basic Information Card -->
        <Card class="border-l-secondary-500 border-l-4">
            <template #content>
                <div class="space-y-6 p-6">
                    <div class="flex items-center space-x-3">
                        <div
                            class="bg-secondary-50 flex h-10 w-10 items-center justify-center rounded-full">
                            <FontAwesomeIcon :icon="faEdit" class="text-secondary-600" />
                        </div>
                        <div class="flex w-full items-center justify-between">
                            <div>
                                <h3 class="text-xl font-semibold text-gray-900">
                                    Basis informatie
                                </h3>
                                <p class="text-sm text-gray-600">
                                    Voer de basisgegevens van uw locatie in
                                </p>
                            </div>
                            <div class="flex items-center space-x-2">
                                <LanguageSelector v-model="currentLanguage">
                                    <template #button="{ toggle, currentFlag, currentLabel }">
                                        <Button @click="toggle" severity="contrast">
                                            <img
                                                :src="currentFlag"
                                                alt="flag"
                                                class="mr-2 h-5 w-5" />
                                            <span class="text-sm">{{ currentLabel }}</span>
                                        </Button>
                                    </template>
                                </LanguageSelector>
                            </div>
                        </div>
                    </div>

                    <!-- Location Name -->
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
                        <h4 class="mb-4 text-lg font-medium text-gray-900">
                            Uitgebreide beschrijving
                        </h4>

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
                                {{ (form.description?.[currentLanguage] || '').length }}/500
                                karakters
                            </small>
                        </div>
                    </div>
                </div>
            </template>
        </Card>

        <!-- Location Details Card -->
        <Card class="border-l-primary-500 border-l-4">
            <template #content>
                <div class="space-y-6 p-6">
                    <div class="flex items-center space-x-3">
                        <div
                            class="bg-primary-100 flex h-10 w-10 items-center justify-center rounded-full">
                            <FontAwesomeIcon :icon="faHome" class="text-primary-600" />
                        </div>
                        <div>
                            <h3 class="text-xl font-semibold text-gray-900">Adres informatie</h3>
                            <p class="text-sm text-gray-600">Voer het adres van uw locatie in</p>
                        </div>
                    </div>

                    <!-- Manual Address Entry -->
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label
                                for="street"
                                class="mb-2 block text-sm font-medium text-gray-700">
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
                            <label
                                for="number"
                                class="mb-2 block text-sm font-medium text-gray-700">
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
                                ✓ Bevestigd:
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
                    <template v-if="showMapDialog">
                        <div class="h-[400px] w-full" id="map-container">
                            <AddressMap v-model:center="mapCenter" :zoom="18"> </AddressMap>
                        </div>
                    </template>
                </div>
            </template>
        </Card>
    </div>
</template>
