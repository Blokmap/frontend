<script setup lang="ts">
import ReservationStateLabel from '@/components/features/reservation/ReservationStateLabel.vue';
import Calendar from '@/components/shared/calendar/Calendar.vue';
import CalendarControls from '@/components/shared/calendar/CalendarControls.vue';
import { useVimControls } from '@/composables/useVimControls';
import type { Reservation } from '@/types/schema/Reservation';
import { ReservationState } from '@/types/schema/Reservation';
import { endOfWeek, startOfWeek } from '@/utils/date';
import { getLocationAddress } from '@/utils/location';
import { reservationsToTimeSlots } from '@/utils/reservation';
import { faCalendarCheck, faClock, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';

const props = defineProps<{
    dateInWeek: Date;
    reservations?: Reservation[];
}>();

const emit = defineEmits<{
    'update:dateInWeek': [value: Date];
}>();

const weekStart = computed(() => startOfWeek(props.dateInWeek));
const weekEnd = computed(() => endOfWeek(props.dateInWeek));

const reservationTimeSlots = computed(() =>
    reservationsToTimeSlots(props.reservations, weekStart.value, weekEnd.value),
);

// Vim controls for calendar navigation
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

function goToPreviousWeek(): void {
    const newDate = new Date(weekStart.value);
    newDate.setDate(newDate.getDate() - 7);
    emit('update:dateInWeek', newDate);
}

function goToNextWeek(): void {
    const newDate = new Date(weekStart.value);
    newDate.setDate(newDate.getDate() + 7);
    emit('update:dateInWeek', newDate);
}

function goToToday(): void {
    emit('update:dateInWeek', new Date());
}

function handleDateSelect(date: any): void {
    if (date && date instanceof Date) {
        emit('update:dateInWeek', date);
    }
}
</script>

<template>
    <div class="flex h-full flex-col space-y-6">
        <CalendarControls
            :current-week="dateInWeek"
            @click:previous-week="goToPreviousWeek"
            @click:next-week="goToNextWeek"
            @click:current-week="goToToday"
            @select:date="handleDateSelect">
        </CalendarControls>

        <div class="flex-1 overflow-hidden">
            <Calendar
                :current-week="dateInWeek"
                :time-slots="reservationTimeSlots"
                :on-previous-week="goToPreviousWeek"
                :on-next-week="goToNextWeek"
                class="h-full">
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
                                    <FontAwesomeIcon
                                        :icon="faCalendarCheck"
                                        class="capacity-icon" />
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
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

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
