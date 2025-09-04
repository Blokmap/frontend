<script setup lang="ts">
import ReservationCalendar from '@/components/features/reservation/ReservationCalendar.vue';
import CalendarControls from '@/components/shared/calendar/CalendarControls.vue';
import { useAuthProfile } from '@/composables/data/useAuth';
import { useProfileReservations } from '@/composables/data/useProfile';
import { formatDate } from '@vueuse/core';
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

// Calendar navigation functions
function goToPreviousWeek(): void {
    const newDate = new Date(dateInWeek.value);
    newDate.setDate(newDate.getDate() - 7);
    handleDateInWeekUpdate(newDate);
}

function goToNextWeek(): void {
    const newDate = new Date(dateInWeek.value);
    newDate.setDate(newDate.getDate() + 7);
    handleDateInWeekUpdate(newDate);
}

function goToToday(): void {
    handleDateInWeekUpdate(new Date());
}

function handleDateSelect(date: any): void {
    if (date instanceof Date) {
        handleDateInWeekUpdate(date);
    }
}
</script>

<template>
    <div class="space-y-6">
        <div class="flex h-full flex-col space-y-6">
            <CalendarControls
                :current-week="dateInWeek"
                @click:previous-week="goToPreviousWeek"
                @click:next-week="goToNextWeek"
                @click:current-week="goToToday"
                @select:date="handleDateSelect">
            </CalendarControls>

            <div class="flex-1 overflow-hidden">
                <ReservationCalendar
                    v-model:date-in-week="dateInWeek"
                    :reservations="reservations"
                    @update:date-in-week="handleDateInWeekUpdate">
                </ReservationCalendar>
            </div>
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
