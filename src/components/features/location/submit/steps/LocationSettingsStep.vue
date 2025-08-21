<script setup lang="ts">
import LocationSubmitCard from '../LocationSubmitCard.vue';
import type { SubStep } from '@/types/contract/LocationWizard';
import type { CreateLocationRequest } from '@/types/schema/Location';
import { faCircleQuestion, faClock, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Checkbox from 'primevue/checkbox';
import InputNumber from 'primevue/inputnumber';
import { watchEffect } from 'vue';

const form = defineModel<CreateLocationRequest>({ required: true });
const substeps = defineModel<SubStep[]>('substeps', { default: [] });

watchEffect(() => {
    const data = form.value;
    const hasSeats = data.seatCount > 0;
    const hasReservability = typeof data.isReservable === 'boolean';

    substeps.value = [
        {
            label: 'Zitplaatsen configureren',
            isCompleted: hasSeats,
        },
        {
            label: 'Reservatie-instellingen',
            isCompleted: hasReservability,
        },
    ];
});
</script>

<template>
    <div class="space-y-8">
        <!-- Seat Configuration -->
        <LocationSubmitCard :icon="faUsers">
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
                        input-id="seatCount"
                        v-model="form.seatCount"
                        :min="1"
                        placeholder="Bijv. 50"
                        class="w-full">
                    </InputNumber>
                    <p class="text-xs text-slate-500">
                        Het maximum aantal personen dat tegelijk kan reserveren in normale
                        omstandigheden
                        <FontAwesomeIcon
                            :icon="faCircleQuestion"
                            v-tooltip="
                                'Je kan per openingstijd dit aantal overschrijven wanneer nodig.'
                            ">
                        </FontAwesomeIcon>
                    </p>
                </div>

                <div class="checkbox" @click="form.isVisible = !form.isVisible">
                    <div class="flex gap-3">
                        <Checkbox input-id="visible" v-model="form.isVisible" binary />
                        <label for="visible"> Meteen zichtbaar maken </label>
                    </div>
                    <p>
                        Vink dit uit als je nog wil wachten met het zichtbaar maken van de locatie
                        na goedkeuring.
                    </p>
                </div>
            </template>
        </LocationSubmitCard>
        <LocationSubmitCard :icon="faClock">
            <template #header>
                <h3 class="text-xl font-semibold text-gray-900">Reservaties</h3>
                <p class="text-sm text-gray-600">
                    Bepaal hoe mensen reservaties kunnen maken voor deze locatie
                </p>
            </template>
            <template #default>
                <div class="checkbox" @click="form.isReservable = !form.isReservable">
                    <div class="flex gap-3">
                        <Checkbox input-id="reservable" v-model="form.isReservable" binary />
                        <label for="reservable"> De locatie is reserveerbaar </label>
                    </div>
                    <p>Vink dit aan om gebruik te maken van het reservatiesysteem.</p>
                </div>
                <template v-if="form.isReservable"> </template>
            </template>
        </LocationSubmitCard>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.checkbox {
    @apply w-full cursor-pointer space-y-2 rounded-lg bg-slate-100 p-3;

    label {
        @apply cursor-pointer text-sm font-medium;
    }

    p {
        @apply text-xs text-slate-500;
    }
}
</style>
