<script setup lang="ts">
import type { OpeningTimeRequest } from '@/types/schema/LocationRequest';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import FloatLabel from 'primevue/floatlabel';
import { computed, ref } from 'vue';

const props = defineProps<{
    openingTimes: OpeningTimeRequest[];
}>();

const emit = defineEmits<{
    'update:opening-times': [times: OpeningTimeRequest[]];
}>();

const showAddDialog = ref(false);
const selectedDay = ref<number | null>(null);
const selectedTime = ref<{ start: string; end: string }>({ start: '09:00', end: '17:00' });

const daysOfWeek = [
    { value: 1, label: 'Maandag', short: 'Ma' },
    { value: 2, label: 'Dinsdag', short: 'Di' },
    { value: 3, label: 'Woensdag', short: 'Wo' },
    { value: 4, label: 'Donderdag', short: 'Do' },
    { value: 5, label: 'Vrijdag', short: 'Vr' },
    { value: 6, label: 'Zaterdag', short: 'Za' },
    { value: 0, label: 'Zondag', short: 'Zo' },
];

const timeSlots = [
    '00:00',
    '00:30',
    '01:00',
    '01:30',
    '02:00',
    '02:30',
    '03:00',
    '03:30',
    '04:00',
    '04:30',
    '05:00',
    '05:30',
    '06:00',
    '06:30',
    '07:00',
    '07:30',
    '08:00',
    '08:30',
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
    '18:00',
    '18:30',
    '19:00',
    '19:30',
    '20:00',
    '20:30',
    '21:00',
    '21:30',
    '22:00',
    '22:30',
    '23:00',
    '23:30',
];

const hours = Array.from({ length: 24 }, (_, i) => i);

const openingTimesByDay = computed(() => {
    const byDay: Record<number, OpeningTimeRequest[]> = {};

    daysOfWeek.forEach((day) => {
        byDay[day.value] = props.openingTimes
            .filter((time) => time.dayOfWeek === day.value)
            .sort((a, b) => a.startTime.localeCompare(b.startTime));
    });

    return byDay;
});

function getTimePosition(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return ((hours * 60 + minutes) / (24 * 60)) * 100;
}

function getTimeHeight(startTime: string, endTime: string): number {
    const start = getTimePosition(startTime);
    const end = getTimePosition(endTime);
    return end - start;
}

function handleDayClick(dayOfWeek: number) {
    selectedDay.value = dayOfWeek;
    selectedTime.value = { start: '09:00', end: '17:00' };
    showAddDialog.value = true;
}

function addOpeningTime() {
    if (selectedDay.value === null) return;

    const newTime: OpeningTimeRequest = {
        dayOfWeek: selectedDay.value,
        startTime: selectedTime.value.start,
        endTime: selectedTime.value.end,
        seatCount: null,
        reservableFrom: null,
        reservableUntil: null,
    };

    const updatedTimes = [...props.openingTimes, newTime];
    emit('update:opening-times', updatedTimes);

    showAddDialog.value = false;
    selectedDay.value = null;
}

function removeOpeningTime(timeToRemove: OpeningTimeRequest) {
    const updatedTimes = props.openingTimes.filter(
        (time) =>
            !(
                time.dayOfWeek === timeToRemove.dayOfWeek &&
                time.startTime === timeToRemove.startTime &&
                time.endTime === timeToRemove.endTime
            ),
    );
    emit('update:opening-times', updatedTimes);
}

function getDayLabel(dayOfWeek: number): string {
    return daysOfWeek.find((d) => d.value === dayOfWeek)?.label || '';
}
</script>

<template>
    <div class="calendar-view rounded-lg border border-gray-200 bg-white">
        <!-- Header -->
        <div class="calendar-header">
            <!-- Time column header -->
            <div class="time-header"></div>

            <!-- Day headers -->
            <div v-for="day in daysOfWeek" :key="day.value" class="day-header">
                <div class="day-name">{{ day.label }}</div>
                <div class="day-short">{{ day.short }}</div>
            </div>
        </div>

        <!-- Calendar body -->
        <div class="calendar-body">
            <!-- Time column -->
            <div class="time-column">
                <div v-for="hour in hours" :key="hour" class="time-slot">
                    {{ hour.toString().padStart(2, '0') }}:00
                </div>
            </div>

            <!-- Day columns -->
            <div
                v-for="day in daysOfWeek"
                :key="day.value"
                class="day-column"
                @click="handleDayClick(day.value)">
                <!-- Hour grid -->
                <div v-for="hour in hours" :key="hour" class="hour-cell"></div>

                <!-- Opening times -->
                <div
                    v-for="(time, index) in openingTimesByDay[day.value]"
                    :key="index"
                    class="opening-time-block"
                    :style="{
                        top: `${getTimePosition(time.startTime)}%`,
                        height: `${getTimeHeight(time.startTime, time.endTime)}%`,
                    }">
                    <div class="opening-time-content">
                        <div class="time-range">{{ time.startTime }} - {{ time.endTime }}</div>
                        <div v-if="time.seatCount" class="seat-count">
                            Max {{ time.seatCount }} plaatsen
                        </div>

                        <Button
                            @click.stop="removeOpeningTime(time)"
                            size="small"
                            severity="danger"
                            text
                            class="remove-button">
                            <FontAwesomeIcon :icon="faTrash" />
                        </Button>
                    </div>
                </div>

                <!-- Add button for empty days -->
                <div v-if="openingTimesByDay[day.value].length === 0" class="add-button-overlay">
                    <Button
                        @click.stop="handleDayClick(day.value)"
                        severity="secondary"
                        outlined
                        size="small">
                        <FontAwesomeIcon :icon="faPlus" class="mr-2" />
                        Toevoegen
                    </Button>
                </div>
            </div>
        </div>
    </div>

    <!-- Add Opening Time Dialog -->
    <Dialog v-model:visible="showAddDialog" modal :draggable="false" class="w-96">
        <template #header>
            <h3 class="text-lg font-semibold">
                Openingstijd toevoegen - {{ selectedDay !== null ? getDayLabel(selectedDay) : '' }}
            </h3>
        </template>

        <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <FloatLabel>
                        <Dropdown
                            id="start-time"
                            v-model="selectedTime.start"
                            :options="timeSlots"
                            class="w-full"
                            placeholder=" " />
                        <label for="start-time">Van</label>
                    </FloatLabel>
                </div>

                <div>
                    <FloatLabel>
                        <Dropdown
                            id="end-time"
                            v-model="selectedTime.end"
                            :options="timeSlots"
                            class="w-full"
                            placeholder=" " />
                        <label for="end-time">Tot</label>
                    </FloatLabel>
                </div>
            </div>
        </div>

        <template #footer>
            <div class="flex justify-end gap-2">
                <Button @click="showAddDialog = false" severity="secondary" outlined>
                    Annuleren
                </Button>
                <Button @click="addOpeningTime"> Toevoegen </Button>
            </div>
        </template>
    </Dialog>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.calendar-view {
    min-height: 400px;
    max-height: 600px;
    overflow: hidden;
}

.calendar-header {
    @apply grid border-b border-gray-200 bg-gray-50;
    grid-template-columns: 80px repeat(7, 1fr);
}

.time-header {
    @apply border-r border-gray-200 p-3;
}

.day-header {
    @apply border-r border-gray-200 p-3 text-center last:border-r-0;

    .day-name {
        @apply text-sm font-medium text-gray-900;
    }

    .day-short {
        @apply text-xs text-gray-500 md:hidden;
    }

    @media (max-width: 768px) {
        .day-name {
            @apply hidden;
        }
    }
}

.calendar-body {
    @apply grid overflow-auto;
    grid-template-columns: 80px repeat(7, 1fr);
    max-height: 500px;
}

.time-column {
    @apply sticky left-0 z-10 border-r border-gray-200 bg-gray-50;

    .time-slot {
        @apply border-b border-gray-100 p-2 text-right text-xs text-gray-600;
        height: 40px;
    }
}

.day-column {
    @apply relative cursor-pointer border-r border-gray-200 transition-colors last:border-r-0 hover:bg-gray-50;
    min-height: 960px; /* 24 hours * 40px */

    .hour-cell {
        @apply border-b border-gray-100;
        height: 40px;
    }

    .opening-time-block {
        @apply bg-primary-100 border-primary-200 absolute right-1 left-1 z-20 overflow-hidden rounded border;
        min-height: 20px;

        .opening-time-content {
            @apply text-primary-700 relative p-1 text-xs;

            .time-range {
                @apply font-medium;
            }

            .seat-count {
                @apply text-primary-600;
            }

            .remove-button {
                @apply absolute top-0 right-0 opacity-0 transition-opacity;

                &:hover {
                    @apply opacity-100;
                }
            }
        }

        &:hover .remove-button {
            @apply opacity-100;
        }
    }

    .add-button-overlay {
        @apply absolute inset-0 z-10 flex items-center justify-center opacity-0 transition-opacity;

        &:hover {
            @apply opacity-100;
        }
    }

    &:hover .add-button-overlay {
        @apply opacity-100;
    }
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .calendar-header {
        grid-template-columns: 60px repeat(7, 1fr);
    }

    .calendar-body {
        grid-template-columns: 60px repeat(7, 1fr);
    }

    .time-column {
        .time-slot {
            @apply p-1 text-xs;
        }
    }

    .opening-time-block .opening-time-content {
        @apply p-0.5 text-xs;
    }
}
</style>
