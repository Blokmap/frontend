<script setup lang="ts">
import Button from 'primevue/button';
import Calendar from '@/components/shared/molecules/calendar/Calendar.vue';
import { faSlash, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';
import { toTimeslots, type TimeSlot } from '@/domain/calendar';
import { type Reservation, type ReservationRequest } from '@/domain/reservation';
import { timeToString } from '@/utils/time';
import {
    isOpeningTimeSlot,
    isReservationRequestSlot,
    isReservationSlot,
    type OpeningMetadata,
    type RequestMetadata,
    type ReservationMetadata,
    type SlotMetadata,
} from './index';
import type { OpeningTime } from '@/domain/openings';

const props = defineProps<{
    currentWeek: Date;
    openingTimes: OpeningTime[];
    reservations: Reservation[];
    reservationsToDelete: Reservation[];
    reservationsToCreate: ReservationRequest[];
    isSaving?: boolean;
}>();

const emit = defineEmits<{
    'click:opening': [slot: TimeSlot<OpeningTime>, event: Event];
    'delete:request': [request: ReservationRequest];
    'delete:reservation': [reservation: Reservation];
}>();

// Opening Time timeslots
const openingTimeSlots = computed<TimeSlot<OpeningMetadata>[]>(() => {
    if (!props.openingTimes) return [];

    const timeslots = toTimeslots(props.openingTimes).map((slot): TimeSlot<OpeningMetadata> => {
        const metadata = { type: 'opening', data: slot.metadata! } as const;

        return {
            ...slot,
            metadata,
        };
    });

    return timeslots;
});

// Existing Reservations timeslots
const reservationTimeSlots = computed((): TimeSlot<ReservationMetadata>[] => {
    if (!props.reservations) return [];

    const timeslots = toTimeslots(props.reservations).map((slot): TimeSlot<ReservationMetadata> => {
        const metadata = { type: 'reservation', data: slot.metadata! } as const;

        return {
            ...slot,
            metadata,
        };
    });

    return timeslots;
});

// Tentative Reservation timeslots
const reservationRequestTimeSlots = computed<TimeSlot<RequestMetadata>[]>(() => {
    if (!props.reservationsToCreate) return [];

    const timeslots = toTimeslots(props.reservationsToCreate).map(
        (slot): TimeSlot<RequestMetadata> => {
            const metadata = { type: 'request', data: slot.metadata! } as const;

            return {
                ...slot,
                metadata,
            };
        },
    );

    return timeslots;
});

// All time slots combined
const allTimeSlots = computed<TimeSlot<SlotMetadata>[]>(() => {
    return [
        ...openingTimeSlots.value,
        ...reservationTimeSlots.value,
        ...reservationRequestTimeSlots.value,
    ];
});

/**
 * Checks if a reservation is pending deletion.
 */
function isPendingDeletion(reservation: Reservation): boolean {
    return props.reservationsToDelete.some((pd) => pd.id === reservation.id);
}

/**
 * Handles click on an opening time slot.
 */
function onOpeningTimeClick(slot: TimeSlot<OpeningMetadata>, event: Event): void {
    if (props.isSaving || !slot.metadata) return;

    const data: TimeSlot<OpeningTime> = {
        ...slot,
        metadata: slot.metadata.data,
    };

    emit('click:opening', data, event);
}

/**
 * Handles deletion of a reservation request.
 */
function onRequestDelete(request: ReservationRequest): void {
    if (props.isSaving) return;
    emit('delete:request', request);
}

/**
 * Handles deletion of a reservation.
 */
function onReservationDelete(reservation: Reservation): void {
    if (props.isSaving) return;
    emit('delete:reservation', reservation);
}
</script>

<template>
    <div class="rounded-lg border border-gray-200">
        <Calendar
            class="h-full"
            :current-week="currentWeek"
            :time-slots="allTimeSlots"
            :enable-dragging="false">
            <template #time-slot="{ slot }">
                <!-- Opening Time Slot -->
                <template v-if="isOpeningTimeSlot(slot)">
                    <div class="opening-time-card" @click="onOpeningTimeClick(slot, $event)">
                        <div class="time-display">
                            <span class="time-text">
                                {{ timeToString(slot.startTime) }}-{{ timeToString(slot.endTime) }}
                            </span>
                        </div>
                    </div>
                </template>

                <!-- Reservation Slot -->
                <template v-else-if="isReservationSlot(slot)">
                    <div
                        class="reservation-card"
                        :class="{ deleted: isPendingDeletion(slot.metadata.data) }">
                        <Button
                            rounded
                            class="delete-btn"
                            size="small"
                            severity="contrast"
                            :disabled="isSaving"
                            @click.stop="onReservationDelete(slot.metadata.data)"
                            text>
                            <template #icon>
                                <FontAwesomeIcon :icon="faTrash" class="h-3 w-3" />
                            </template>
                        </Button>
                        <FontAwesomeIcon
                            :icon="faSlash"
                            class="delete-cross"
                            v-if="isPendingDeletion(slot.metadata.data)">
                        </FontAwesomeIcon>
                        <div class="time-display">
                            <span class="time-text">
                                {{ timeToString(slot.startTime) }}-{{ timeToString(slot.endTime) }}
                            </span>
                        </div>
                    </div>
                </template>

                <!-- Reservation Request Slot -->
                <template v-else-if="isReservationRequestSlot(slot)">
                    <div class="reservation-request-card">
                        <Button
                            rounded
                            class="delete-btn"
                            size="small"
                            severity="contrast"
                            :disabled="isSaving"
                            @click.stop="onRequestDelete(slot.metadata.data)"
                            text>
                            <template #icon>
                                <FontAwesomeIcon :icon="faTrash" class="h-3 w-3" />
                            </template>
                        </Button>
                        <div class="time-display">
                            <span class="time-text">
                                {{ timeToString(slot.startTime) }}-{{ timeToString(slot.endTime) }}
                            </span>
                        </div>
                    </div>
                </template>
            </template>
        </Calendar>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.opening-time-card {
    @apply relative h-full bg-slate-100;
    @apply flex items-center justify-center p-2;
    @apply cursor-pointer;
    @apply hover:bg-slate-200;

    .time-display {
        @apply text-slate-600;
    }
}

.reservation-card {
    @apply bg-secondary-100 relative h-full p-2;
    @apply border-secondary-500 border-l-3;
    @apply flex items-center justify-center;
    @apply transition-all duration-150;

    .time-display {
        @apply text-secondary-800;
        @apply flex items-center justify-center;
    }

    .delete-btn {
        @apply !absolute top-1 right-1 z-10;
        @apply text-secondary-600;
        @apply opacity-0 hover:opacity-100;
        @apply transition-opacity duration-150;
    }

    .delete-cross {
        @apply absolute top-1/2 left-1/2;
        @apply -translate-x-1/2 -translate-y-1/2;
        @apply text-4xl text-red-700;
    }

    &:hover .delete-btn {
        @apply opacity-100;
    }

    &.deleted {
        @apply border-red-700 bg-red-100;

        .time-display {
            @apply text-red-700;
        }

        .delete-btn {
            @apply text-red-700;
        }
    }
}

.reservation-request-card {
    @apply bg-secondary-100 relative h-full p-2;
    @apply border-secondary-400 border-l-3 border-dashed;
    @apply flex items-center justify-center;
    @apply transition-all duration-150;

    .time-display {
        @apply text-secondary-700;
        @apply flex items-center justify-center;
    }

    .delete-btn {
        @apply !absolute top-1 right-1 z-10;
        @apply text-secondary-500;
        @apply opacity-0 hover:opacity-100;
        @apply transition-opacity duration-150;
    }

    &:hover .delete-btn {
        @apply opacity-100;
    }
}

.time-display {
    @apply flex items-center justify-center text-center;

    .time-text {
        @apply text-xs font-medium;
    }
}
</style>
