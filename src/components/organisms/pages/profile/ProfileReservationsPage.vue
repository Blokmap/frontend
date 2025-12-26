<script lang="ts" setup>
import CalendarControls from '@/components/molecules/calendar/CalendarControls.vue';
import ProfileReservations from '@/components/molecules/profile/ProfileReservations.vue';
import ReservationCard from '@/components/molecules/reservation/ReservationCard.vue';
import ReservationDayCard from '@/components/molecules/reservation/ReservationDayCard.vue';
import { computed } from 'vue';
import { useAuthProfile } from '@/composables/data/useAuth';
import { useReadRecentProfileLocations } from '@/composables/data/useLocations';
import {
    useDeleteReservation,
    useReadProfileReservations,
} from '@/composables/data/useReservations';
import { useRouteDate } from '@/composables/useRouteDate';
import { type ReservationFilter, type Reservation } from '@/domain/reservation';

const { data: profile } = useAuthProfile();

const profileId = computed<string | null>(() => profile.value?.id || null);

const { data: recentLocations } = useReadRecentProfileLocations(
    profileId,
    computed(() => ({ maxCount: 5 })),
);

const currentDate = useRouteDate();

const filters = computed<ReservationFilter>(() => ({
    inWeekOf: currentDate.value,
}));

const { data: reservations, isLoading: loading } = useReadProfileReservations(profileId, filters);

const {
    mutate: deleteReservation,
    isPending: isDeleting,
    variables: deletingVariables,
} = useDeleteReservation();

function onCancel(reservation: Reservation) {
    deleteReservation({ reservationId: reservation.id });
}

function isCancelling(reservationId: string) {
    return isDeleting && deletingVariables?.value?.reservationId === reservationId;
}
</script>

<template>
    <div class="profile-reservations space-y-6">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 class="text-3xl font-extrabold">Mijn reservaties</h2>
            <CalendarControls v-model:date="currentDate" />
        </div>

        <ProfileReservations
            :reservations="reservations"
            :recent-locations="recentLocations"
            :loading="loading"
            :current-date="currentDate">
            <template #card="{ day, reservations: dayReservations }">
                <ReservationDayCard :day="day">
                    <template #reservation v-if="dayReservations.length > 0">
                        <ReservationCard
                            v-for="reservation in dayReservations"
                            :key="reservation.id"
                            :reservation="reservation"
                            :is-cancelling="isCancelling(reservation.id)"
                            @click:cancel="onCancel">
                        </ReservationCard>
                    </template>
                    <template #empty>
                        <div class="day-card__empty">Geen reservaties</div>
                    </template>
                </ReservationDayCard>
            </template>
        </ProfileReservations>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
