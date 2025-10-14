<script setup lang="ts">
import InputText from 'primevue/inputtext';
import ReservationsTable from '@/components/features/reservation/ReservationsTable.vue';
import DateInput from '@/components/shared/molecules/form/DateInput.vue';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, ref } from 'vue';
import {
    useConfirmReservation,
    useReadLocationReservations,
} from '@/composables/data/useReservations';
import { useToast } from '@/composables/store/useToast';
import type { Reservation } from '@/domain/reservation';

const props = defineProps<{
    locationId: string;
}>();

const toast = useToast();

const selectedDate = ref<Date>(new Date());
const searchQuery = ref<string>('');
const pendingConfirmations = ref<Set<number>>(new Set());

// Fetch reservations for the selected date
const { data: reservations, isLoading } = useReadLocationReservations(
    computed(() => +props.locationId),
    selectedDate,
);

// Mutation for confirming a single reservation
const { mutateAsync: confirmReservation } = useConfirmReservation({
    onSuccess: () => {
        toast.add({
            severity: 'success',
            summary: 'Reservering bevestigd',
            detail: 'De reservering is succesvol bevestigd.',
        });
    },
    onError: () => {
        toast.add({
            severity: 'error',
            summary: 'Fout bij bevestigen',
            detail: 'Er is iets misgegaan bij het bevestigen van de reservering.',
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
    return pendingConfirmations.value.has(reservationId);
};

// Handle confirming a single reservation
const handleConfirmReservation = async (reservationId: number) => {
    pendingConfirmations.value.add(reservationId);
    try {
        await confirmReservation({
            locationId: +props.locationId,
            reservationId,
        });
    } finally {
        pendingConfirmations.value.delete(reservationId);
    }
};

// Handle confirming all reservations for a profile
const handleConfirmProfile = async (profileId: number) => {
    if (!reservations.value) return;

    const profileReservations = reservations.value.filter(
        (r: Reservation) => r.createdBy?.id === profileId && !r.confirmedAt,
    );

    // Mark all as pending
    for (const reservation of profileReservations) {
        pendingConfirmations.value.add(reservation.id);
    }

    try {
        // Confirm all reservations in parallel
        await Promise.all(
            profileReservations.map((reservation: Reservation) =>
                confirmReservation({
                    locationId: +props.locationId,
                    reservationId: reservation.id,
                }),
            ),
        );

        toast.add({
            severity: 'success',
            summary: 'Reserveringen bevestigd',
            detail: `Alle reserveringen voor deze gebruiker zijn bevestigd.`,
        });
    } catch {
        toast.add({
            severity: 'error',
            summary: 'Fout bij bevestigen',
            detail: 'Er is iets misgegaan bij het bevestigen van de reserveringen.',
        });
    } finally {
        // Remove all from pending
        for (const reservation of profileReservations) {
            pendingConfirmations.value.delete(reservation.id);
        }
    }
};
</script>

<template>
    <div class="space-y-6">
        <!-- Filters -->
        <div class="flex flex-wrap gap-4">
            <!-- Date Selector -->
            <div class="min-w-[200px] flex-1">
                <label class="mb-2 block text-sm font-medium text-slate-700">Datum</label>
                <DateInput v-model:date="selectedDate" />
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
            @confirm:reservation="handleConfirmReservation"
            @confirm:profile="handleConfirmProfile" />
    </div>
</template>
