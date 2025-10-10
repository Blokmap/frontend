<script setup lang="ts">
import ReservationStateLabel from '@/components/features/reservation/ReservationStateLabel.vue';
import Calendar from '@/components/shared/molecules/calendar/Calendar.vue';
import { faClock, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';
import { formatLocationAddress } from '@/domain/location';
import { ReservationState, reservationsToTimeSlots } from '@/domain/reservation';
import { endOfWeek, startOfWeek } from '@/utils/date';
import type { Reservation } from '@/domain/reservation';

const props = defineProps<{
    dateInWeek: Date;
    reservations?: Reservation[];
}>();

const weekStart = computed(() => startOfWeek(props.dateInWeek));
const weekEnd = computed(() => endOfWeek(props.dateInWeek));

const reservationTimeSlots = computed(() =>
    reservationsToTimeSlots(props.reservations, weekStart.value, weekEnd.value),
);
</script>

<template>
    <Calendar
        :current-week="dateInWeek"
        :time-slots="reservationTimeSlots"
        :enable-dragging="false"
        :time-interval="15"
        :min-slot-duration="15"
        class="h-full">
        <template #time-slot="{ slot: { metadata, startTime, endTime } }">
            <div v-if="metadata?.location" class="reservation-card">
                <!-- Header with status and time -->
                <div class="mb-3 flex items-center justify-between">
                    <ReservationStateLabel
                        v-if="metadata.state !== ReservationState.Created"
                        :state="metadata.state" />
                    <div class="time-display">
                        <FontAwesomeIcon :icon="faClock" class="time-icon" />
                        <span class="time-text">{{ startTime }}-{{ endTime }}</span>
                    </div>
                </div>

                <!-- Location details -->
                <div class="space-y-3">
                    <h4 class="text-sm font-semibold text-gray-900">
                        {{ metadata.location.name }}
                    </h4>

                    <div class="text-xs">
                        {{ formatLocationAddress(metadata.location) }}
                    </div>

                    <!-- Capacity info with vertical layout -->
                    <div class="space-y-1 text-xs text-gray-800">
                        <div class="capacity-item">
                            <FontAwesomeIcon :icon="faUsers" class="capacity-icon" />
                            <span>
                                {{ metadata.openingTime?.seatCount ?? metadata.location.seatCount }}
                                plaatsen
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </Calendar>
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
