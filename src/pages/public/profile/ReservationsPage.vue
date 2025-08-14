<script setup lang="ts">
import ReservationCalendar from '@/components/features/reservation/ReservationCalendar.vue';
import { useAuthProfile } from '@/composables/data/useAuth';
import { useProfileReservations } from '@/composables/data/useProfile';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { formatDate } from '@vueuse/core';
import Button from 'primevue/button';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

const { profileId } = useAuthProfile();

const reservationsLoading = computed(
    () => reservationsIsLoading.value || reservationsIsPending.value,
);

const dateInWeek = computed(() => {
    const dateParam = route.params.inWeekOf?.toString();
    const date = new Date(dateParam);
    return isNaN(date.getTime()) ? new Date() : date;
});

const {
    isLoading: reservationsIsLoading,
    isPending: reservationsIsPending,
    data: reservations,
} = useProfileReservations(profileId, dateInWeek);

function handleDateInWeekUpdate(newDate: Date): void {
    const dateString = formatDate(newDate, 'YYYY-MM-DD');
    router.push({
        name: 'profile.reservations',
        params: {
            inWeekOf: dateString,
        },
    });
}

function goBackToProfile(): void {
    router.push({ name: 'profile' });
}
</script>

<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="flex w-full items-center gap-4 py-3">
            <Button @click="goBackToProfile" severity="secondary" text rounded>
                <template #icon>
                    <FontAwesomeIcon :icon="faArrowLeft" />
                </template>
            </Button>
            <h1
                class="absolute left-1/2 -translate-x-1/2 transform text-3xl font-bold text-gray-900">
                Mijn Reservaties
            </h1>
        </div>

        <ReservationCalendar
            v-model:date-in-week="dateInWeek"
            :reservations="reservations"
            @update:date-in-week="handleDateInWeekUpdate">
        </ReservationCalendar>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
