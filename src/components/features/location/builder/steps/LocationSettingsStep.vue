<script setup lang="ts">
import Checkbox from 'primevue/checkbox';
import InputNumber from 'primevue/inputnumber';

import { faCircleQuestion, faClock, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { watchEffect } from 'vue';

import LocationBuilderCard from '../LocationBuilderCard.vue';

import type { BuilderSubstep, LocationRequest } from '@/domain/location';

const form = defineModel<LocationRequest>('form', { required: true });
const substeps = defineModel<BuilderSubstep[]>('substeps', { default: [] });

watchEffect(() => {
    const data = form.value;
    const hasSeats = data.seatCount > 0;

    substeps.value = [
        {
            label: 'Zitplaatsen configureren',
            isCompleted: hasSeats,
        },
        {
            label: 'Reservatie-instellingen',
            isCompleted: true,
        },
    ];
});
</script>

<template>
    <div class="space-y-8">
        <!-- Seat Configuration -->
        <LocationBuilderCard :icon="faUsers">
            <template #header>
                <h3 class="text-xl font-semibold text-gray-900">Zitplaatsen</h3>
                <p class="text-sm text-gray-600">
                    Configureer het aantal beschikbare zitplaatsen voor reservaties
                </p>
            </template>
            <template #default>
                <div class="space-y-2">
                    <label for="seatCount" class="block text-sm font-medium">
                        Aantal zitplaatsen
                    </label>
                    <InputNumber
                        v-model="form.seatCount"
                        input-id="seatCount"
                        :min="1"
                        placeholder="Bijv. 50"
                        class="w-full" />
                    <p class="text-xs text-slate-500">
                        Het maximum aantal personen dat tegelijk kan reserveren in normale
                        omstandigheden
                        <FontAwesomeIcon
                            v-tooltip="
                                'Je kan per openingstijd dit aantal overschrijven wanneer nodig.'
                            "
                            :icon="faCircleQuestion" />
                    </p>
                </div>

                <div class="checkbox" @click="form.isVisible = !form.isVisible">
                    <div class="flex gap-3">
                        <Checkbox v-model="form.isVisible" input-id="visible" binary />
                        <label for="visible"> Meteen zichtbaar maken </label>
                    </div>
                    <p>
                        Vink dit uit als je nog wil wachten met het zichtbaar maken van de locatie
                        na goedkeuring.
                    </p>
                </div>
            </template>
        </LocationBuilderCard>
        <LocationBuilderCard :icon="faClock">
            <template #header>
                <h3 class="text-xl font-semibold text-gray-900">Reservaties</h3>
                <p class="text-sm text-gray-600">
                    Bepaal hoe mensen reservaties kunnen maken voor deze locatie
                </p>
            </template>
            <template #default>
                <div class="checkbox" @click="form.isReservable = !form.isReservable">
                    <div class="flex gap-3">
                        <Checkbox v-model="form.isReservable" input-id="reservable" binary />
                        <label for="reservable"> De locatie is reserveerbaar </label>
                    </div>
                    <p>Vink dit aan om gebruik te maken van het reservatiesysteem.</p>
                </div>
                <template v-if="form.isReservable" />
            </template>
        </LocationBuilderCard>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.checkbox {
    @apply w-full cursor-pointer space-y-2 rounded-lg bg-slate-100 p-3;
    @apply border-1 border-slate-200;

    label {
        @apply cursor-pointer text-sm font-medium;
    }

    p {
        @apply text-xs text-slate-500;
    }
}
</style>
