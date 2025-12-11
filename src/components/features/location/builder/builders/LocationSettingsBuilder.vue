<script setup lang="ts">
import InputNumber from 'primevue/inputnumber';
import FormCheckbox from '@/components/shared/molecules/form/FormCheckbox.vue';
import InputHint from '@/components/shared/molecules/form/InputHint.vue';
import InputLabel from '@/components/shared/molecules/form/InputLabel.vue';
import { faCircleQuestion, faClock, faCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import LocationBuilderCard from '../LocationBuilderCard.vue';
import type { LocationBody } from '@/domain/location';

const form = defineModel<LocationBody>('form', {
    required: true,
});
</script>

<template>
    <form class="space-y-8">
        <!-- Settings Card -->
        <LocationBuilderCard :icon="faCog">
            <template #header>
                <h3 class="text-xl font-semibold text-gray-900">Instellingen</h3>
                <p class="text-sm text-gray-600">
                    Configureer algemene instellingen voor deze locatie
                </p>
            </template>
            <template #default>
                <FormCheckbox
                    v-model="form.isVisible"
                    input-id="visible"
                    label="Meteen zichtbaar maken"
                    description="Vink dit uit als je nog wil wachten met het zichtbaar maken van de locatie na goedkeuring.">
                </FormCheckbox>
            </template>
        </LocationBuilderCard>
        <LocationBuilderCard :icon="faClock">
            <template #header>
                <h3 class="text-xl font-semibold text-gray-900">Bezetting</h3>
                <p class="text-sm text-gray-600">
                    Bepaal hoe mensen reservaties kunnen maken voor deze locatie
                </p>
            </template>
            <template #default>
                <div>
                    <InputLabel html-for="seatCount"> Aantal zitplaatsen </InputLabel>
                    <InputNumber
                        v-model="form.seatCount"
                        input-id="seatCount"
                        :min="1"
                        placeholder="Bijv. 50"
                        class="w-full">
                    </InputNumber>
                    <InputHint>
                        Het maximum aantal personen dat tegelijk kan reserveren in normale
                        omstandigheden
                        <FontAwesomeIcon
                            v-tooltip="
                                'Je kan per openingstijd dit aantal overschrijven wanneer nodig.'
                            "
                            :icon="faCircleQuestion">
                        </FontAwesomeIcon>
                    </InputHint>
                </div>
                <FormCheckbox
                    v-model="form.isReservable"
                    input-id="reservable"
                    label="De locatie is reserveerbaar"
                    description="Vink dit aan om gebruik te maken van het reservatiesysteem.">
                </FormCheckbox>
            </template>
        </LocationBuilderCard>
    </form>
</template>
