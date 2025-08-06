<script lang="ts" setup>
import Calendar from '@/components/shared/calendar/Calendar.vue';
import CalendarControls from '@/components/shared/calendar/CalendarControls.vue';
import { useAuthProfile } from '@/composables/data/useAuth';
import { useProfileReservations } from '@/composables/data/useReservations';
import { useVimControls } from '@/composables/useVimControls';
import { endOfWeek, startOfWeek } from '@/utils/date';
import { reservationsToTimeSlots } from '@/utils/reservation';
import { formatDate } from '@vueuse/core';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const profile = useAuthProfile();
const reservations = useProfileReservations(profile.profileId);

useVimControls({
    onDown: goToPreviousWeek,
    onUp: goToNextWeek,
    onLeft: goToPreviousWeek,
    onRight: goToNextWeek,
});

const dateInWeek = computed(() => {
    const dateParam = route.params.dateInWeek?.toString();
    const date = new Date(dateParam);
    return isNaN(date.getTime()) ? new Date() : date;
});

const weekStart = computed(() => startOfWeek(dateInWeek.value));
const weekEnd = computed(() => endOfWeek(dateInWeek.value));

const reservationTimeSlots = computed(() =>
    reservationsToTimeSlots(reservations.data.value, weekStart.value, weekEnd.value),
);

function goToPreviousWeek(): void {
    const newDate = new Date(weekStart.value);
    newDate.setDate(newDate.getDate() - 7);
    navigateToWeek(newDate);
}

function goToNextWeek(): void {
    const newDate = new Date(weekStart.value);
    newDate.setDate(newDate.getDate() + 7);
    navigateToWeek(newDate);
}

function goToToday(): void {
    navigateToWeek(new Date());
}

function handleDateSelect(date: any): void {
    if (date && date instanceof Date) {
        navigateToWeek(date);
    }
}

function navigateToWeek(date: Date): void {
    const dateString = formatDate(date, 'YYYY-MM-DD');

    router.push({
        name: route.name,
        params: {
            ...route.params,
            dateInWeek: dateString,
        },
    });
}
</script>

<template>
    <div class="mt-3 space-y-6">
        <div class="text-center">
            <h1 class="text-3xl font-bold text-gray-900">Mijn Reservaties</h1>
        </div>

        <CalendarControls
            :current-week="dateInWeek"
            @click:previous-week="goToPreviousWeek"
            @click:next-week="goToNextWeek"
            @click:current-week="goToToday"
            @select:date="handleDateSelect">
        </CalendarControls>

        <Calendar
            :current-week="dateInWeek"
            :time-slots="reservationTimeSlots"
            :on-previous-week="goToPreviousWeek"
            :on-next-week="goToNextWeek">
            <template #time-slot="{ slot }"></template>
        </Calendar>
    </div>
</template>

<style scoped></style>
