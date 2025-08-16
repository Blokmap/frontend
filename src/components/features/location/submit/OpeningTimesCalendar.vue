<script setup lang="ts">
import Calendar from '@/components/shared/calendar/Calendar.vue';
import CalendarControls from '@/components/shared/calendar/CalendarControls.vue';
import { useVimControls } from '@/composables/useVimControls';
import type { CreateOpeningTimeRequest } from '@/types/schema/Location';
import type { TimeSlot } from '@/types/schema/Reservation';
import { endOfWeek, startOfWeek } from '@/utils/date/date';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';

const props = defineProps<{
    dateInWeek: Date;
    openingTimes: CreateOpeningTimeRequest[];
}>();

const emit = defineEmits<{
    'update:dateInWeek': [value: Date];
    'select:slot': [slot: { day: Date; time: string }];
    'edit:slot': [index: number, slot: CreateOpeningTimeRequest];
    'delete:slot': [index: number];
}>();

const weekStart = computed(() => startOfWeek(props.dateInWeek));
const weekEnd = computed(() => endOfWeek(props.dateInWeek));

// Convert opening times to time slots for calendar display
const calendarTimeSlots = computed(() => {
    return props.openingTimes.map((ot, index) => {
        const startTime = new Date(ot.startTime);
        const endTime = new Date(ot.endTime);
        const duration = {
            hours: Math.floor((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60)),
            minutes: Math.floor(
                ((endTime.getTime() - startTime.getTime()) % (1000 * 60 * 60)) / (1000 * 60),
            ),
        };

        return {
            id: `opening-time-${index}`,
            day: new Date(ot.startTime),
            startTime: startTime.toLocaleTimeString('nl-NL', {
                hour: '2-digit',
                minute: '2-digit',
            }),
            endTime: endTime.toLocaleTimeString('nl-NL', {
                hour: '2-digit',
                minute: '2-digit',
            }),
            duration,
            metadata: {
                openingTime: ot,
                index,
            },
        };
    });
});

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

function handleSlotClick(slot: { day: Date; time: string }): void {
    emit('select:slot', slot);
}

function handleEditSlot(slot: TimeSlot): void {
    const openingTimeSlot = slot;
    if (openingTimeSlot.metadata) {
        emit('edit:slot', openingTimeSlot.metadata.index, openingTimeSlot.metadata.openingTime);
    }
}

function handleDeleteSlot(slot: TimeSlot): void {
    const openingTimeSlot = slot;
    if (openingTimeSlot.metadata) {
        emit('delete:slot', openingTimeSlot.metadata.index);
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
                :time-slots="calendarTimeSlots"
                :on-previous-week="goToPreviousWeek"
                :on-next-week="goToNextWeek"
                @click:time-slot="handleSlotClick"
                class="h-full">
                <template #time-slot="{ slot }">
                    <div class="opening-time-card group">
                        <div class="flex-1">
                            <div class="time-display">
                                <span class="time-text"
                                    >{{ slot.startTime }}-{{ slot.endTime }}</span
                                >
                            </div>
                        </div>

                        <!-- Actions at bottom with subtle styling -->
                        <div class="actions">
                            <button
                                @click.stop="handleEditSlot(slot)"
                                class="action-btn edit-btn"
                                title="Bewerken">
                                <FontAwesomeIcon :icon="faEdit" />
                            </button>
                            <button
                                @click.stop="handleDeleteSlot(slot)"
                                class="action-btn delete-btn"
                                title="Verwijderen">
                                <FontAwesomeIcon :icon="faTrash" />
                            </button>
                        </div>
                    </div>
                </template>
            </Calendar>
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.opening-time-card {
    @apply bg-primary-100 border-primary-500 relative h-full min-h-[60px] rounded-lg border-l-4 p-3;
    @apply flex flex-col justify-between;
    @apply transition-all duration-200 hover:shadow-sm;
}

.time-display {
    @apply text-primary-700 flex items-center justify-center text-center;

    .time-text {
        @apply text-xs font-semibold;
    }
}

.actions {
    @apply mt-2 flex items-center justify-center gap-1;
    @apply opacity-0 transition-opacity duration-200 group-hover:opacity-100;
}

.action-btn {
    @apply flex h-5 w-5 items-center justify-center rounded-full transition-all duration-150;
    @apply text-xs opacity-70 hover:opacity-100;
}

.edit-btn {
    @apply text-blue-500 hover:bg-blue-50 hover:text-blue-600;
}

.delete-btn {
    @apply text-red-500 hover:bg-red-50 hover:text-red-600;
}
</style>
