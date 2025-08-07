<script lang="ts" setup>
import ReservationStateLabel from '@/components/features/reservation/ReservationStateLabel.vue';
import Calendar from '@/components/shared/calendar/Calendar.vue';
import CalendarControls from '@/components/shared/calendar/CalendarControls.vue';
import { useAuthProfile } from '@/composables/data/useAuth';
import { useProfileReservations } from '@/composables/data/useReservations';
import { useVimControls } from '@/composables/useVimControls';
import { ReservationState } from '@/types/schema/Reservation';
import { endOfWeek, startOfWeek } from '@/utils/date';
import { getLocationAddress } from '@/utils/location';
import { reservationsToTimeSlots } from '@/utils/reservation';
import { faCalendarCheck, faClock, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { formatDate } from '@vueuse/core';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const profile = useAuthProfile();

const { data: reservations } = useProfileReservations(profile.profileId);

useVimControls({
    previousWeek: {
        keys: ['j', 'ArrowLeft'],
        callback: goToPreviousWeek,
    },
    nextWeek: {
        keys: ['k', 'ArrowRight'],
        callback: goToNextWeek,
    },
    goToToday: {
        keys: ['t', 'Home'],
        callback: goToToday,
    },
});

const dateInWeek = computed(() => {
    const dateParam = route.params.dateInWeek?.toString();
    const date = new Date(dateParam);
    return isNaN(date.getTime()) ? new Date() : date;
});

const weekStart = computed(() => startOfWeek(dateInWeek.value));
const weekEnd = computed(() => endOfWeek(dateInWeek.value));

const reservationTimeSlots = computed(() =>
    reservationsToTimeSlots(reservations.value, weekStart.value, weekEnd.value),
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
            <template #time-slot="{ slot: { reservation, startTime, endTime, duration } }">
                <div v-if="reservation?.location" class="reservation-card">
                    <!-- Header with status and time -->
                    <div class="mb-3 flex items-center justify-between">
                        <ReservationStateLabel
                            :state="reservation.state"
                            v-if="reservation.state !== ReservationState.Created">
                        </ReservationStateLabel>
                        <div class="time-display">
                            <FontAwesomeIcon :icon="faClock" class="time-icon" />
                            <span class="time-text">{{ startTime }}-{{ endTime }}</span>
                        </div>
                    </div>

                    <!-- Location details -->
                    <div class="space-y-3">
                        <h4 class="text-sm font-semibold text-gray-900">
                            {{ reservation.location.name }}
                        </h4>

                        <div class="text-xs">
                            {{ getLocationAddress(reservation.location) }}
                        </div>

                        <!-- Capacity info with vertical layout -->
                        <div class="space-y-1 text-xs text-gray-800">
                            <div class="capacity-item">
                                <FontAwesomeIcon :icon="faUsers" class="capacity-icon" />
                                <span>
                                    {{
                                        reservation.openingTime?.seatCount ??
                                        reservation.location.seatCount
                                    }}
                                    plaatsen
                                </span>
                            </div>

                            <div class="capacity-item">
                                <FontAwesomeIcon :icon="faCalendarCheck" class="capacity-icon" />
                                <span>
                                    {{ duration.hours }}u {{ duration.minutes }}m studeren
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </Calendar>
    </div>
</template>

<style scoped>
@import '@/assets/styles/main.css';

.reservation-card {
    @apply border-primary-500 bg-primary-100 relative h-full min-h-[80px] rounded-lg border-l-4 p-3;
}

.time-display {
    @apply text-primary-700 flex items-center gap-1;

    .time-icon {
        @apply h-3 w-3;
    }

    .time-text {
        @apply text-xs font-semibold;
    }
}

.capacity-item {
    @apply flex items-center gap-2;
}

.capacity-icon {
    @apply text-secondary h-3 w-3;
}
</style>
