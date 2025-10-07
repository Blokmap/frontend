<script setup lang="ts">
import Button from 'primevue/button';
import Calendar from 'primevue/calendar';
import Checkbox from 'primevue/checkbox';
import Dialog from 'primevue/dialog';
import InputNumber from 'primevue/inputnumber';
import { faPlus, faTrash, faRepeat, faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import {
    DEFAULT_OPENING_TIME_REQUEST,
    DEFAULT_REPETITION_CONFIG,
    type OpeningTimeRequest,
} from '@/domain/openings';
import { dateToTime, timeToDate } from '@/utils/time';

const props = defineProps<{
    openingTime: OpeningTimeRequest | null;
    editMode: 'single' | 'recurring' | null;
}>();

const visible = defineModel<boolean>('visible', {
    default: false,
});

const emit = defineEmits<{
    save: [openingTime: OpeningTimeRequest];
    delete: [];
}>();

const { locale } = useI18n();

const openingTime = ref<OpeningTimeRequest>(DEFAULT_OPENING_TIME_REQUEST);

const isRepetitionEnabled = computed({
    get: () => !!openingTime.value.repetition,
    set: (enabled: boolean) => {
        if (enabled) {
            openingTime.value.repetition = { ...DEFAULT_REPETITION_CONFIG };
        } else {
            delete openingTime.value.repetition;
        }
    },
});

const weekDays = computed(() => {
    return Array.from({ length: 7 }, (_, index) => {
        const date = new Date(2024, 0, 1 + index);
        const dayName = date.toLocaleDateString(locale.value, { weekday: 'short' });

        return {
            label: dayName.charAt(0).toUpperCase() + dayName.slice(1),
            value: index,
        };
    });
});

const startTime = computed({
    get: () => {
        return timeToDate(openingTime.value.startTime);
    },
    set: (timeOnlyDate: Date) => {
        openingTime.value.startTime = dateToTime(timeOnlyDate);
    },
});

const endTime = computed({
    get: () => {
        return timeToDate(openingTime.value.endTime);
    },
    set: (timeOnlyDate: Date) => {
        openingTime.value.endTime = dateToTime(timeOnlyDate);
    },
});

const date = computed({
    get: () => {
        const day = openingTime.value.day;
        return day instanceof Date ? new Date(day) : new Date(day);
    },
    set: (newDate: Date) => {
        openingTime.value.day = new Date(newDate);
    },
});

watch(
    () => props.openingTime,
    (newValue) => {
        if (newValue) {
            openingTime.value = { ...newValue };
        }
    },
    { deep: true, immediate: true },
);

function toggleDaySelection(dayIndex: number): void {
    const repetition = openingTime.value.repetition;

    if (!isRepetitionEnabled.value || !repetition) return;

    const selectedDays = repetition.selectedDays || [];
    const index = selectedDays.indexOf(dayIndex);

    if (index > -1) {
        selectedDays.splice(index, 1);
    } else {
        selectedDays.push(dayIndex);
    }

    repetition.selectedDays = [...selectedDays];
}

function isDaySelected(dayIndex: number): boolean {
    const repetition = openingTime.value.repetition;
    return repetition?.selectedDays?.includes(dayIndex) || false;
}

function onSaveClick(): void {
    emit('save', openingTime.value);
}

function onDeleteClick(): void {
    emit('delete');
}
</script>

<template>
    <Dialog v-model:visible="visible" :style="{ width: '480px' }" modal>
        <template #header>
            <div class="flex items-center gap-2">
                <FontAwesomeIcon :icon="faCalendarDays" class="text-primary-500" />
                <span v-if="editMode !== null">Openingstijd Bewerken</span>
                <span v-else>Openingstijd Toevoegen</span>
            </div>
        </template>

        <div class="space-y-5">
            <!-- Main Time Selection - Compact Grid -->
            <div class="grid grid-cols-3 items-end gap-3">
                <div>
                    <label class="mb-1 block text-xs font-medium text-gray-600">Datum</label>
                    <Calendar v-model="date" date-format="dd/mm" class="w-full text-sm"> </Calendar>
                </div>
                <div>
                    <label class="mb-1 block text-xs font-medium text-gray-600">Van</label>
                    <Calendar
                        v-model="startTime"
                        show-time
                        time-only
                        hour-format="24"
                        class="w-full text-sm">
                    </Calendar>
                </div>
                <div>
                    <label class="mb-1 block text-xs font-medium text-gray-600">Tot</label>
                    <Calendar v-model="endTime" show-time time-only hour-format="24" class="w-full">
                    </Calendar>
                </div>
            </div>

            <!-- Seats -->
            <div class="space-y-1">
                <label class="block text-sm font-medium text-gray-700">Stoelen</label>
                <InputNumber v-model="openingTime.seatCount" :min="1" :max="999" class="w-full">
                </InputNumber>
            </div>

            <!-- Repetition Toggle -->
            <div class="space-y-3 rounded-lg border border-slate-200 bg-gray-50 p-4">
                <div class="flex items-center gap-3">
                    <Checkbox v-model="isRepetitionEnabled" binary input-id="repetition-enabled" />
                    <label
                        for="repetition-enabled"
                        class="flex cursor-pointer items-center gap-2 text-sm font-medium">
                        <FontAwesomeIcon :icon="faRepeat" class="text-primary-500" />
                        Herhaling inschakelen
                    </label>
                </div>

                <!-- Repetition Settings -->
                <div v-if="isRepetitionEnabled" class="space-y-4 border-t border-gray-200 pt-2">
                    <!-- Days Selection -->
                    <div>
                        <label class="mb-2 block text-xs font-medium text-gray-600">Dagen</label>
                        <div class="flex gap-1">
                            <button
                                v-for="day in weekDays"
                                :key="day.value"
                                @click="toggleDaySelection(day.value)"
                                :class="[
                                    'day-button-compact',
                                    { selected: isDaySelected(day.value) },
                                ]">
                                {{ day.label.substring(0, 2) }}
                            </button>
                        </div>
                    </div>

                    <!-- End Date -->
                    <div>
                        <label class="mb-1 block text-xs font-medium text-gray-600">
                            Einddatum
                        </label>
                        <Calendar
                            v-model="openingTime.repetition!.endDate"
                            :min-date="date"
                            date-format="dd/mm/yy"
                            class="w-full text-sm">
                        </Calendar>
                    </div>
                </div>
            </div>
        </div>

        <template #footer>
            <div class="flex w-full items-center justify-between gap-3">
                <Button
                    v-if="editMode !== null"
                    severity="contrast"
                    variant="outlined"
                    @click="onDeleteClick">
                    <FontAwesomeIcon :icon="faTrash" class="mr-2" />
                    Verwijderen
                </Button>

                <Button @click="onSaveClick" class="px-6">
                    <FontAwesomeIcon :icon="faPlus" class="mr-2" />
                    {{ editMode !== null ? 'Bijwerken' : 'Toevoegen' }}
                </Button>
            </div>
        </template>
    </Dialog>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.day-button-compact {
    @apply h-8 w-8 rounded text-xs font-medium transition-all duration-200;
    @apply border border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50;

    &.selected {
        @apply bg-secondary-500 border-secondary-500 hover:bg-secondary-600 text-white;
    }
}
</style>
