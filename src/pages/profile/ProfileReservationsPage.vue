<script lang="ts" setup>
import ProfileReservations from '@/components/features/profile/ProfileReservations.vue';
import CalendarControls from '@/components/shared/molecules/calendar/CalendarControls.vue';
import { computed, ref } from 'vue';
import { useAuthProfile } from '@/composables/data/useAuth';
import { useReadRecentProfileLocations } from '@/composables/data/useLocations';
import {
    useDeleteReservation,
    useReadProfileReservations,
} from '@/composables/data/useReservations';
import { type Reservation } from '@/domain/reservation';

const { data: profile } = useAuthProfile();

const currentDate = ref(new Date());

const { data: recentLocations } = useReadRecentProfileLocations(
    computed(() => profile.value?.id ?? null),
    computed(() => ({ maxCount: 5 })),
);

const { data: reservations, isLoading: loading } = useReadProfileReservations(
    computed(() => profile.value?.id ?? null),
    computed(() => ({ inWeekOf: currentDate.value })),
);

const { mutate: deleteReservation, isPending: isDeleting } = useDeleteReservation();
const cancellingId = ref<string | null>(null);

function onCancel(reservation: Reservation) {
    cancellingId.value = reservation.id;
    deleteReservation(
        { reservationId: reservation.id },
        {
            onSettled: () => {
                cancellingId.value = null;
            },
        },
    );
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
            :current-date="currentDate"
            :cancelling-reservation-id="isDeleting ? cancellingId : null"
            @cancel="onCancel">
        </ProfileReservations>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
