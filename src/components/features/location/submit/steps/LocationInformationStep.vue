<script setup lang="ts">
import LanguageSelector from '@/components/features/layout/LanguageSelector.vue';
import AddressMap from '@/components/features/map/AddressMap.vue';
import { useForwardGeoSearch } from '@/composables/data/useGeoCoding';
import type { LngLat } from '@/types/contract/Map';
import type { CreateLocationRequest } from '@/types/schema/Location';
import { faEdit, faHome, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const form = defineModel<CreateLocationRequest>({ required: true });

const { locale } = useI18n();

const currentLanguage = ref(locale.value);
const showMapDialog = ref(false);
const mapCenter = ref<LngLat>([4.3517, 50.8503]);

const { geocodeAddress, isLoading } = useForwardGeoSearch();

const currentAddress = computed(() => {
    const { street, number, city } = form.value;

    if (street && number && city) {
        return `${street} ${number}, ${city}`;
    }

    return '';
});

const canConfirmAddress = computed(() => {
    return !!(form.value.street && form.value.number && form.value.city);
});

const hasCoordinates = computed(() => {
    return !!(form.value.latitude && form.value.longitude);
});

const handleConfirmAddress = async () => {
    if (!canConfirmAddress.value) return;

    try {
        const coordinates = await geocodeAddress(currentAddress.value);
        if (coordinates) {
            mapCenter.value = coordinates;
            form.value.latitude = coordinates[1];
            form.value.longitude = coordinates[0];
        }
        showMapDialog.value = true;
    } catch (error) {
        mapCenter.value = [4.3517, 50.8503];
        form.value.latitude = 50.8503;
        form.value.longitude = 4.3517;
        showMapDialog.value = true;
    }
};

const handleMapConfirm = () => {
    form.value.latitude = mapCenter.value[1];
    form.value.longitude = mapCenter.value[0];
    showMapDialog.value = false;
};

const handleMapCancel = () => {
    showMapDialog.value = false;
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
                            Kies een herkenbare naam voor uw locatie
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
                    <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
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
                                placeholder="Bijv. Nieuwstraat" />
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
                                placeholder="Bijv. 123" />
                        </div>

                        <div>
                            <label for="city" class="mb-2 block text-sm font-medium text-gray-700">
                                Stad *
                            </label>
                            <InputText
                                id="city"
                                v-model="form.city"
                                class="w-full"
                                placeholder="Bijv. Brussel" />
                        </div>
                    </div>

                    <!-- Address Confirmation Button -->
                    <div class="flex items-center justify-between rounded-lg bg-gray-50 p-4">
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
                            {{ hasCoordinates ? 'Wijzig locatie' : 'Bevestig op kaart' }}
                        </Button>
                    </div>
                </div>
            </template>
        </Card>

        <!-- Address Confirmation Map Dialog -->
        <Dialog
            v-model:visible="showMapDialog"
            modal
            header="Bevestig locatie op kaart"
            class="address-confirmation-dialog">
            <div class="space-y-4">
                <div class="text-center">
                    <h3 class="text-lg font-semibold text-gray-900">{{ currentAddress }}</h3>
                    <p class="text-sm text-gray-600">
                        Sleep de kaart om de exacte locatie te bepalen. Het kruisje in het midden
                        toont de gekozen positie.
                    </p>
                </div>

                <div class="h-96 overflow-hidden rounded-lg">
                    <AddressMap v-model:center="mapCenter" :zoom="16"> </AddressMap>
                </div>

                <div class="rounded-lg bg-gray-50 p-3">
                    <div class="text-sm text-gray-600">
                        <strong>Huidige coördinaten:</strong><br />
                        Lat: {{ mapCenter[1]?.toFixed(6) }}, Lng: {{ mapCenter[0]?.toFixed(6) }}
                    </div>
                </div>
            </div>

            <template #footer>
                <div class="flex justify-end space-x-2">
                    <Button @click="handleMapCancel" severity="secondary" outlined>
                        Annuleren
                    </Button>
                    <Button @click="handleMapConfirm"> Locatie bevestigen </Button>
                </div>
            </template>
        </Dialog>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.address-confirmation-dialog :deep(.p-dialog-content) {
    padding: 1.5rem;
}

.address-confirmation-dialog :deep(.p-dialog) {
    max-width: 90vw;
    max-height: 90vh;
}
</style>
