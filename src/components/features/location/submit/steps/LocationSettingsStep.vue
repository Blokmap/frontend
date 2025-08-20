<script setup lang="ts">
import type { SubStep } from '@/types/contract/LocationWizard';
import type { CreateLocationRequest } from '@/types/schema/Location';
import { faClock, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Checkbox from 'primevue/checkbox';
import InputNumber from 'primevue/inputnumber';
import { watchEffect } from 'vue';

const form = defineModel<CreateLocationRequest>({ required: true });
const substeps = defineModel<SubStep[]>('substeps', { default: [] });

// Populate substeps for sidebar display
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
        <div class="rounded-lg border-2 border-slate-200 bg-white p-6">
            <div class="space-y-6">
                <!-- Header -->
                <div class="flex items-center space-x-3">
                    <div
                        class="bg-secondary-100 flex h-10 w-10 items-center justify-center rounded-full">
                        <FontAwesomeIcon :icon="faUsers" class="text-secondary-600" />
                    </div>
                    <div>
                        <h3 class="text-xl font-semibold text-gray-900">Zitplaatsen</h3>
                        <p class="text-sm text-gray-600">
                            Configureer het aantal beschikbare zitplaatsen voor reservaties
                        </p>
                    </div>
                </div>

                <!-- Content -->
                <div>
                    <label for="seatCount" class="mb-2 block text-sm font-medium">
                        Aantal zitplaatsen
                    </label>
                    <InputNumber
                        id="seatCount"
                        v-model="form.seatCount"
                        :min="1"
                        :max="1000"
                        placeholder="Bijv. 50"
                        class="w-full" />
                    <small class="text-slate-500">
                        Het totaal aantal personen dat tegelijk kan reserveren.
                    </small>
                </div>
            </div>
        </div>

        <!-- Reservation Settings -->
        <div class="rounded-lg border-2 border-slate-200 bg-white p-6">
            <div class="space-y-6">
                <!-- Header -->
                <div class="flex items-center space-x-3">
                    <div
                        class="bg-secondary-100 flex h-10 w-10 items-center justify-center rounded-full">
                        <FontAwesomeIcon :icon="faClock" class="text-secondary-600" />
                    </div>
                    <div>
                        <h3 class="text-xl font-semibold text-gray-900">Reservatie-instellingen</h3>
                        <p class="text-sm text-gray-600">
                            Bepaal hoe mensen reservaties kunnen maken voor deze locatie
                        </p>
                    </div>
                </div>

                <!-- Content -->
                <div class="space-y-6">
                    <div class="flex items-center gap-3">
                        <Checkbox id="isReservable" v-model="form.isReservable" :binary="true" />
                        <label for="isReservable" class="text-sm font-medium">
                            Reservaties toestaan
                        </label>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
