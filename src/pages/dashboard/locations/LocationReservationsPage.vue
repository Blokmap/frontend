<script setup lang="ts">
import InputText from 'primevue/inputtext';
import ReservationsTable from '@/components/features/reservation/ReservationsTable.vue';
import DateInput from '@/components/shared/molecules/form/DateInput.vue';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, ref } from 'vue';
import {
    useReadLocationReservations,
    useReservationState,
} from '@/composables/data/useReservations';
import { useToast } from '@/composables/store/useToast';
import { useRouteDate } from '@/composables/useRouteDate';
import type { Reservation, ReservationState } from '@/domain/reservation';

const props = defineProps<{
    locationId: string;
}>();

const toast = useToast();

const searchQuery = ref<string>('');
const pendingStatusChanges = ref<Set<number>>(new Set());
const selectedDay = useRouteDate({ paramName: 'day' });

// Fetch reservations for the selected date
const { data: reservations, isLoading } = useReadLocationReservations(
    computed(() => +props.locationId),
    computed(() => ({ day: selectedDay.value })),
);

// Mutation for changing reservation state
const { mutateAsync: changeReservationState } = useReservationState({
    onSuccess: () => {
        toast.add({
            severity: 'success',
            summary: 'Status gewijzigd',
            detail: 'De reserveringsstatus is succesvol gewijzigd.',
        });
    },
    onError: (error: any) => {
        const message = error.message || 'Er is iets misgegaan bij het wijzigen van de status.';

        toast.add({
            severity: 'error',
            summary: 'Fout bij wijzigen van reservatiestatus',
            detail: message,
        });
    },
});

// Filter reservations based on search query
const filteredReservations = computed(() => {
    if (!reservations.value) return [];
    if (!searchQuery.value.trim()) return reservations.value;

    const query = searchQuery.value.toLowerCase();

    return reservations.value.filter((reservation: Reservation) => {
        const profile = reservation.createdBy;
        if (!profile) return false;

        const fullName = `${profile.firstName} ${profile.lastName}`.toLowerCase();
        const username = profile.username?.toLowerCase() || '';
        const email = profile.email?.toLowerCase() || '';

        return fullName.includes(query) || username.includes(query) || email.includes(query);
    });
});

// Check if a reservation is pending confirmation
const isReservationPending = (reservationId: number) => {
    return pendingStatusChanges.value.has(reservationId);
};

// Handle changing reservation status
async function onStatusChange(reservationId: number, state: ReservationState) {
    pendingStatusChanges.value.add(reservationId);

    try {
        await changeReservationState({
            locationId: +props.locationId,
            reservationId,
            state,
        });
    } finally {
        pendingStatusChanges.value.delete(reservationId);
    }
}
</script>

<template>
    <div class="space-y-6">
        <!-- Filters -->
        <div class="flex flex-wrap gap-4">
            <!-- Date Selector -->
            <div class="min-w-[200px] flex-1">
                <label class="mb-2 block text-sm font-medium text-slate-700">Datum</label>
                <DateInput v-model:date="selectedDay" />
            </div>

            <!-- Search -->
            <div class="min-w-[300px] flex-1">
                <label class="mb-2 block text-sm font-medium text-slate-700">Zoeken</label>
                <div class="relative">
                    <InputText
                        v-model="searchQuery"
                        placeholder="Zoek op naam, gebruikersnaam of e-mail..."
                        class="w-full pl-10" />
                    <FontAwesomeIcon
                        :icon="faSearch"
                        class="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
                </div>
            </div>
        </div>

        <!-- Reservations Table -->
        <ReservationsTable
            :reservations="filteredReservations"
            :loading="isLoading"
            :is-reservation-pending="isReservationPending"
            @change:status="onStatusChange">
        </ReservationsTable>
    </div>
</template>
