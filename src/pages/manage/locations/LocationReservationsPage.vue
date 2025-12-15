<script lang="ts" setup>
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import ReservationScanner from '@/components/features/reservation/ReservationScanner.vue';
import LocationReservationsTable from '@/components/features/reservation/table/LocationReservationsTable.vue';
import ManageBreadcrumb from '@/components/shared/molecules/Breadcrumb.vue';
import DateInput from '@/components/shared/molecules/form/DateInput.vue';
import PageContent from '@/layouts/PageContent.vue';
import PageTitle from '@/layouts/PageTitle.vue';
import { faQrcode, faSearch } from '@fortawesome/free-solid-svg-icons';
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
    { label: props.location?.name ?? 'Locatie', to: { name: 'manage.location.info' } },
    { label: 'Reservaties' },
]);
</script>

<template>
    <PageContent>
        <ManageBreadcrumb :items="breadcrumbs" />

        <PageTitle title="Reservaties" />

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
