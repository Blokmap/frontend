<script lang="ts" setup>
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import ReservationScanner from '@/components/features/reservation/ReservationScanner.vue';
import LocationReservationsTable from '@/components/features/reservation/table/LocationReservationsTable.vue';
import ManageBreadcrumb from '@/components/shared/molecules/Breadcrumb.vue';
import DateInput from '@/components/shared/molecules/form/DateInput.vue';
import LayoutContent from '@/layouts/LayoutContent.vue';
import LayoutTitle from '@/layouts/LayoutTitle.vue';
import { faQrcode, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useReadLocationReservations } from '@/composables/data/useLocations';
import {
    useReservationState,
    type ReservationStateParams,
} from '@/composables/data/useReservations';
import { useRouteDate } from '@/composables/useRouteDate';
import type { Location } from '@/domain/location';
import type { Profile } from '@/domain/profile';
import type { Reservation, ReservationState } from '@/domain/reservation';

const props = defineProps<{
    authProfile: Profile;
    location: Location;
}>();

const route = useRoute();
const router = useRouter();
const selectedDay = useRouteDate();

const showScanner = computed<boolean>({
    get: () => route.hash === '#scan',
    set: (value: boolean) => {
        if (value) {
            router.replace({ hash: '#scan' });
        } else {
            router.replace({ hash: '' });
        }
    },
});

const { mutateAsync: changeReservationState } = useReservationState({
    onMutate: (variables: ReservationStateParams) => {
        pendingStatusChanges.value.add(variables.reservationId);
    },
    onSuccess: (updatedReservation) => {
        const reservation = reservations.value?.find((r) => r.id === updatedReservation.id);

        if (reservation) {
            Object.assign(reservation, updatedReservation);
        }
    },
    onSettled: (variables: ReservationStateParams) => {
        pendingStatusChanges.value.delete(variables.reservationId);
    },
});

const { data: reservations, isLoading } = useReadLocationReservations(
    computed(() => +props.location.id),
    computed(() => ({ day: selectedDay.value })),
);

const reservationSearchQuery = ref<string>('');
const pendingStatusChanges = ref<Set<string>>(new Set());

const filteredReservations = computed(() => {
    if (!reservations.value) return [];
    if (!reservationSearchQuery.value.trim()) return reservations.value;

    const query = reservationSearchQuery.value.toLowerCase();

    return reservations.value.filter((reservation: Reservation) => {
        const profile = reservation.createdBy;

        if (!profile) {
            return false;
        }

        const fullName = `${profile.firstName} ${profile.lastName}`.toLowerCase();
        const username = profile.username?.toLowerCase() || '';
        const email = profile.email?.toLowerCase() || '';

        return fullName.includes(query) || username.includes(query) || email.includes(query);
    });
});

const breadcrumbs = computed(() => [
    { label: 'Mijn locaties', to: { name: 'manage.locations' } },
    { label: props.location?.name ?? 'Locatie', to: { name: 'manage.location.info' } },
    { label: 'Reservaties' },
]);

function isReservationPending(reservationId: string): boolean {
    return pendingStatusChanges.value.has(reservationId);
}

function onStatusChange(reservationId: string, state: ReservationState): void {
    changeReservationState({ reservationId, state });
}
</script>

<template>
    <LayoutContent>
        <ManageBreadcrumb :items="breadcrumbs" />
        <LayoutTitle title="Reservaties" />

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
                        v-model="reservationSearchQuery"
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
                    name: 'manage.location.reservations',
                    params: { locationId: props.location.id },
                    hash: '#scan',
                }">
                <Button>
                    <FontAwesomeIcon :icon="faQrcode" />
                    <span class="hidden sm:inline">Open Scanner</span>
                    <span class="sm:hidden">Scanner</span>
                </Button>
            </RouterLink>
        </div>

        <!-- Reservation Scanner -->
        <ReservationScanner v-model:visible="showScanner" :location="location" />

        <!-- Reservations Table -->
        <LocationReservationsTable
            :reservations="filteredReservations"
            :loading="isLoading"
            :is-reservation-pending="isReservationPending"
            @change:status="onStatusChange">
        </LocationReservationsTable>
    </LayoutContent>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
