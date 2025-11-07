<script setup lang="ts">
import InputNumber from 'primevue/inputnumber';
import FormCheckbox from '@/components/shared/molecules/form/FormCheckbox.vue';
import { faCircleQuestion, faClock, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import LocationBuilderCard from '../LocationBuilderCard.vue';
import type { LocationBody } from '@/domain/location';
import type { AuthorityMembership } from '@/domain/member';

defineProps<{
    authorities?: AuthorityMembership[];
}>();

const form = defineModel<LocationBody>('form', { required: true });
</script>

<template>
    <div class="space-y-8">
        {{ authorities }}
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
                        class="w-full">
                    </InputNumber>
                    <p class="text-xs text-slate-500">
                        Het maximum aantal personen dat tegelijk kan reserveren in normale
                        omstandigheden
                        <FontAwesomeIcon
                            v-tooltip="
                                'Je kan per openingstijd dit aantal overschrijven wanneer nodig.'
                            "
                            :icon="faCircleQuestion">
                        </FontAwesomeIcon>
                    </p>
                </div>

                <FormCheckbox
                    v-model="form.isVisible"
                    input-id="visible"
                    label="Meteen zichtbaar maken"
                    description="Vink dit uit als je nog wil wachten met het zichtbaar maken van de locatie na goedkeuring." />
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
                <FormCheckbox
                    v-model="form.isReservable"
                    input-id="reservable"
                    label="De locatie is reserveerbaar"
                    description="Vink dit aan om gebruik te maken van het reservatiesysteem." />
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
