<script setup lang="ts">
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import LocationReservationsTable from '@/components/features/reservation/table/LocationReservationsTable.vue';
import DateInput from '@/components/shared/molecules/form/DateInput.vue';
import DashboardContent from '@/layouts/dashboard/DashboardContent.vue';
import { faQrcode, faSearch } from '@fortawesome/free-solid-svg-icons';
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
const selectedDay = useRouteDate();

// Fetch reservations for the selected date
const { data: reservations, isLoading } = useReadLocationReservations(
    computed(() => +props.locationId),
    computed(() => ({ day: selectedDay.value })),
);

// Mutation for changing reservation state
const { mutateAsync: changeReservationState } = useReservationState();

const searchQuery = ref<string>('');
const pendingStatusChanges = ref<Set<string>>(new Set());

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

/**
 * Check if a reservation's state is being changed
 *
 * @param reservationId - ID of the reservation
 */
function isReservationPending(reservationId: string): boolean {
    return pendingStatusChanges.value.has(reservationId);
}

/**
 * Handle changing reservation status
 *
 * @param reservationId - ID of the reservation
 * @param state - New state to set
 */
async function onStatusChange(reservationId: string, state: ReservationState): Promise<void> {
    try {
        pendingStatusChanges.value.add(reservationId);

        const update = await changeReservationState({
            reservationId,
            state,
        });

        if (reservations.value) {
            const reservation = reservations.value.find((r) => r.id === reservationId);

            if (reservation) {
                Object.assign(reservation, update);
            }
        }

        toast.add({
            severity: 'success',
            summary: 'Status gewijzigd',
            detail: 'De reservatiesstatus is succesvol gewijzigd.',
        });
    } catch (error: any) {
        const message = error.message || 'Er is iets misgegaan bij het wijzigen van de status.';

        toast.add({
            severity: 'error',
            summary: 'Fout bij wijzigen van reservatiestatus',
            detail: message,
        });
    } finally {
        pendingStatusChanges.value.delete(reservationId);
    }
}
</script>

<template>
    <DashboardContent>
        <!-- Filters -->
        <div class="flex flex-wrap items-end gap-3 md:gap-4">
            <!-- Date Selector -->
            <div class="min-w-[200px] flex-1">
                <label class="mb-2 block text-sm font-medium text-slate-700">Datum</label>
                <DateInput v-model:date="selectedDay" />
            </div>

            <!-- Search -->
            <div class="min-w-[250px] flex-1 md:min-w-[300px]">
                <label class="mb-2 block text-sm font-medium text-slate-700">Zoeken</label>
                <div class="relative">
                    <InputText
                        v-model="searchQuery"
                        placeholder="Zoek op naam, gebruikersnaam of e-mail..."
                        class="w-full pl-10">
                    </InputText>
                    <FontAwesomeIcon
                        :icon="faSearch"
                        class="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400">
                    </FontAwesomeIcon>
                </div>
            </div>
            <!-- Toggle Scanner -->
            <RouterLink
                :to="{
                    name: 'dashboard.locations.detail.scanner',
                    params: { locationId: props.locationId },
                }">
                <Button>
                    <FontAwesomeIcon :icon="faQrcode" />
                    <span class="hidden sm:inline">Open Scanner</span>
                    <span class="sm:hidden">Scanner</span>
                </Button>
            </RouterLink>
        </div>

        <!-- Reservations Table -->
        <LocationReservationsTable
            :reservations="filteredReservations"
            :loading="isLoading"
            :is-reservation-pending="isReservationPending"
            @change:status="onStatusChange">
        </LocationReservationsTable>
    </DashboardContent>
</template>
