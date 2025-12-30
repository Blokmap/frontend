<script setup lang="ts">
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import Dialog from 'primevue/dialog';
import InputNumber from 'primevue/inputnumber';
import DateInput from '@/components/molecules/form/DateInput.vue';
import TimeInput from '@/components/molecules/form/TimeInput.vue';
import { faPlus, faTrash, faRepeat, faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { WEEK_DAYS } from '@/domain/calendar/calendarConstants';
import {
    DEFAULT_OPENING_TIME_REQUEST,
    DEFAULT_REPETITION_CONFIG,
    type OpeningTimeRequest,
} from '@/domain/openings';
import { formatDayName } from '@/utils/date';

const props = defineProps<{
    openingTime?: OpeningTimeRequest | null;
    isEditing?: boolean | null;
}>();

const visible = defineModel<boolean>('visible', {
    default: false,
});

const emit = defineEmits<{
    save: [openingTime: OpeningTimeRequest, applyToSequence: boolean];
    delete: [openingTime: OpeningTimeRequest, applyToSequence?: boolean];
}>();

const { locale } = useI18n();

const openingTime = ref<OpeningTimeRequest>({ ...DEFAULT_OPENING_TIME_REQUEST });
const applyToSequence = ref<boolean>(false);

watch(
    () => props.openingTime,
    (opening?: OpeningTimeRequest | null) => {
        const def = opening ?? DEFAULT_OPENING_TIME_REQUEST;
        openingTime.value = { ...def };
        applyToSequence.value = false;
    },
    { deep: true, immediate: true },
);

const isRepetitionEnabled = computed({
    get: () => !!openingTime.value.repetition,
    set: (enabled: boolean) => {
        openingTime.value.repetition = enabled ? { ...DEFAULT_REPETITION_CONFIG } : undefined;
    },
});

/**
 *
 * Toggles the selection of a day in the repetition config
 *
 * @param dayIndex - The index of the day to toggle (0 = Sunday, 6 = Saturday)
 */
function toggleDaySelection(dayIndex: number): void {
    const repetition = openingTime.value.repetition;

    if (!repetition) return;

    const selectedDays = repetition.selectedDays || [];
    const index = selectedDays.indexOf(dayIndex);

    if (index > -1) {
        selectedDays.splice(index, 1);
    } else {
        selectedDays.push(dayIndex);
    }

    repetition.selectedDays = [...selectedDays];
}

/**
 * Checks if a day is selected in the repetition config
 *
 * @param dayIndex - The index of the day to check (0 = Sunday, 6 = Saturday)
 * @returns True if the day is selected, false otherwise
 */
function isDaySelected(dayIndex: number): boolean {
    const repetition = openingTime.value.repetition;
    return repetition?.selectedDays?.includes(dayIndex) || false;
}

/**
 * Handles saving the opening time (create or update)
 */
function onSaveClick(): void {
    const payload = { ...openingTime.value };
    emit('save', payload, applyToSequence.value);
}

/**
 * Handles deleting the opening time
 */
function onDeleteClick(): void {
    if (!props.openingTime || !props.isEditing) return;
    emit('delete', props.openingTime, applyToSequence.value);
}
</script>

<template>
    <Dialog v-model:visible="visible" :style="{ width: '480px' }" modal>
        <template #header>
            <div class="flex items-center gap-2">
                <FontAwesomeIcon :icon="faCalendarDays" class="text-primary-500" />
                <span v-if="isEditing">Openingstijd Bewerken</span>
                <span v-else>Openingstijd Toevoegen</span>
            </div>
        </template>

        <div class="space-y-5">
            <!-- Main Time Selection - Compact Grid -->
            <div class="grid grid-cols-3 items-end gap-3">
                <div>
                    <label class="mb-1 block text-xs font-medium text-gray-600">Datum</label>
                    <DateInput v-model:date="openingTime.day" />
                </div>
                <div>
                    <label class="mb-1 block text-xs font-medium text-gray-600">Van</label>
                    <TimeInput v-model="openingTime.startTime" :min-time="{ hours: 0, minutes: 0 }">
                    </TimeInput>
                </div>
                <div>
                    <label class="mb-1 block text-xs font-medium text-gray-600">Tot</label>
                    <TimeInput v-model="openingTime.endTime" :max-time="{ hours: 23, minutes: 59 }">
                    </TimeInput>
                </div>
            </div>

            <!-- Seats -->
            <div class="space-y-1">
                <label class="block text-sm font-medium text-gray-700">Stoelen</label>
                <InputNumber v-model="openingTime.seatCount" :min="1" class="w-full" />
            </div>

            <!-- Repetition Toggle (for creating new) -->
            <div class="repetition" v-if="!isEditing">
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
                            <template v-for="day in WEEK_DAYS" :key="day">
                                <button
                                    :class="[{ selected: isDaySelected(day) }, 'day-btn']"
                                    @click="toggleDaySelection(day)">
                                    {{ formatDayName(day, 'narrow', locale) }}
                                </button>
                            </template>
                        </div>
                    </div>

                    <!-- End Date -->
                    <div v-if="openingTime.repetition">
                        <label class="mb-1 block text-xs font-medium text-gray-600">
                            Einddatum
                        </label>
                        <DateInput v-model:date="openingTime.repetition.endDate"></DateInput>
                    </div>
                </div>
            </div>

            <!-- Apply to Sequence (for editing existing sequence) -->
            <div class="repetition" v-if="openingTime.sequenceId">
                <div class="flex items-center gap-3">
                    <Checkbox v-model="applyToSequence" binary input-id="apply-to-sequence" />
                    <label
                        for="apply-to-sequence"
                        class="flex cursor-pointer items-center gap-2 text-sm font-medium">
                        <FontAwesomeIcon :icon="faRepeat" class="text-primary-500" />
                        Wijzigingen toepassen op hele groep
                    </label>
                </div>
            </div>
        </div>

        <template #footer>
            <div class="flex w-full items-center justify-between gap-3">
                <Button v-if="isEditing" severity="contrast" class="text-sm" @click="onDeleteClick">
                    <FontAwesomeIcon :icon="faTrash" class="mr-2" />
                    <span v-if="applyToSequence">Verwijder Groep</span>
                    <span v-else>Verwijderen</span>
                </Button>

                <Button @click="onSaveClick" class="ml-auto text-sm">
                    <FontAwesomeIcon :icon="faPlus" class="mr-2" />
                    {{ isEditing ? 'Bijwerken' : 'Toevoegen' }}
                </Button>
            </div>
        </template>
    </Dialog>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.day-btn {
    @apply h-6 w-6 rounded-full text-xs font-medium transition-all duration-200;
    @apply border border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50;

    &.selected {
        @apply bg-secondary-500 border-secondary-500 hover:bg-secondary-600 text-white;
    }
}

.repetition {
    @apply space-y-3 rounded-lg border border-slate-200 bg-gray-50 p-4;
}
</style>
