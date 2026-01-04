<script lang="ts" setup>
import Button from 'primevue/button';
import SearchInput from '@/components/atoms/SearchInput.vue';
import DateInput from '@/components/atoms/form/DateInput.vue';
import ManageBreadcrumb from '@/components/molecules/Breadcrumb.vue';
import ReservationScanner from '@/components/molecules/reservation/ReservationScanner.vue';
import LocationReservationsTable from '@/components/molecules/reservation/table/LocationReservationsTable.vue';
import PageContent from '@/components/organisms/pages/PageContent.vue';
import PageFilters from '@/components/organisms/pages/PageFilters.vue';
import PageTitle from '@/components/organisms/pages/PageTitle.vue';
import { faQrcode } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { debouncedWatch } from '@vueuse/core';
import { computed, ref, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useReadLocationReservations } from '@/composables/data/useLocations';
import {
    useReservationState,
    type ReservationStateParams,
} from '@/composables/data/useReservations';
import { useRouteDate } from '@/composables/useRouteDate';
import { type ReservationFilter, type ReservationState } from '@/domain/reservation';
import type { Location } from '@/domain/location';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    authProfile: Profile;
    location: Location;
}>();

const route = useRoute();
const router = useRouter();

const pendingStatusChanges = ref<Set<string>>(new Set());

function isReservationPending(reservationId: string): boolean {
    return pendingStatusChanges.value.has(reservationId);
}

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

function onStatusChange(reservationId: string, state: ReservationState): void {
    changeReservationState({ reservationId, state });
}

const selectedDay = useRouteDate();
const searchQuery = ref<string>('');

const filters = ref<ReservationFilter>({
    day: selectedDay.value,
    query: searchQuery.value,
    state: null,
});

debouncedWatch(
    searchQuery,
    (newQuery: string) => {
        filters.value.query = newQuery;
    },
    { debounce: 300 },
);

watchEffect(() => {
    filters.value.day = selectedDay.value;
});

const locationId = computed<number>(() => {
    return +props.location.id;
});

const { data: reservations, isLoading } = useReadLocationReservations(locationId, filters, {
    includes: ['profile'],
});

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

const breadcrumbs = computed(() => [
    { label: 'Mijn locaties', to: { name: 'manage.locations' } },
    { label: props.location?.name ?? 'Locatie', to: { name: 'manage.location.overview' } },
    { label: 'Reservaties' },
]);
</script>

<template>
    <PageContent>
        <ManageBreadcrumb :items="breadcrumbs" />

        <PageTitle title="Reservaties">
            <template #actions>
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
            </template>
        </PageTitle>

        <!-- Filters -->
        <PageFilters>
            <!-- Date Selector -->
            <div class="min-w-[200px] flex-1">
                <label for="day" class="mb-2 block text-sm font-medium text-slate-700">Datum</label>
                <DateInput input-id="day" v-model:date="selectedDay" />
            </div>
            <!-- Search -->
            <SearchInput
                v-model="searchQuery"
                placeholder="Zoek op naam, gebruikersnaam of e-mail...">
            </SearchInput>
            <!-- State -->
        </PageFilters>

        <!-- Reservation Scanner -->
        <ReservationScanner v-model:visible="showScanner" :location="location" />

        <!-- Reservations Table -->
        <LocationReservationsTable
            :reservations="reservations"
            :loading="isLoading"
            :is-reservation-pending="isReservationPending"
            @change:status="onStatusChange">
        </LocationReservationsTable>
    </PageContent>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
