<script setup lang="ts">
import ConfirmDialog from 'primevue/confirmdialog';
import OpeningTimeDialog from '@/components/features/location/builder/OpeningTimeDialog.vue';
import OpeningTimesCalendar from '@/components/features/location/builder/OpeningTimesCalendar.vue';
import CalendarControls from '@/components/shared/molecules/calendar/CalendarControls.vue';
import { ref, watchEffect } from 'vue';
import { useCalendarControls } from '@/composables/useCalendarControls';
import { DEFAULT_OPENING_TIME_REQUEST, type OpeningTimeRequest } from '@/domain/openings';
import type { TimeCell } from '@/domain/calendar';
import type { BuilderSubstep, LocationRequest } from '@/domain/location';

defineProps<{
    form: LocationRequest;
}>();

const openings = defineModel<OpeningTimeRequest[]>('openings', {
    default: [],
    required: true,
});

const substeps = defineModel<BuilderSubstep[]>('substeps', {
    default: [],
    required: true,
});

const { currentWeek, goToCurrentWeek, goToNextWeek, goToPreviousWeek, goToWeek } =
    useCalendarControls();

const showOpeningDialog = ref(false);
const openingTime = ref<OpeningTimeRequest | null>(null);
const editMode = ref<'single' | 'recurring' | null>(null);

watchEffect(() => {
    const times = openings.value;
    const hasOpeningTimes = times.length > 0;
    const hasUpcomingTimes = times.some((time) => new Date(time.day) > new Date());

    substeps.value = [
        {
            label: 'Openingstijden toevoegen',
            isCompleted: hasOpeningTimes,
        },
        {
            label: 'Toekomstige beschikbaarheid',
            isCompleted: hasUpcomingTimes,
        },
    ];
});

function saveOpeningTime(): void {}

/**
 * Handles the user clicking on a cell in the calendar to add a new opening time.
 * Opens the dialog and resets the opening time to the default.
 */
function onClickCell({ day, startTime, endTime }: TimeCell): void {
    showOpeningDialog.value = true;
    openingTime.value = {
        ...DEFAULT_OPENING_TIME_REQUEST,
        day,
        startTime,
        endTime,
    };
}

function onEditSlot(): void {}

function onDragSlot(): void {}

function closeDialog(): void {}
</script>

<template>
    <ConfirmDialog />

    <div class="space-y-4 pb-20">
        <div class="flex flex-col space-y-6 overflow-visible">
            <CalendarControls
                :current-week="currentWeek"
                @click:previous-week="goToPreviousWeek"
                @click:next-week="goToNextWeek"
                @click:current-week="goToCurrentWeek"
                @select:date="goToWeek">
            </CalendarControls>

            <div class="flex-1">
                <OpeningTimesCalendar
                    v-model:date-in-week="currentWeek"
                    :opening-times="openings"
                    @click:cell="onClickCell"
                    @click:slot="onEditSlot"
                    @drag:slot="onDragSlot">
                </OpeningTimesCalendar>
            </div>
        </div>

        <p class="text-center text-sm text-gray-500">
            Klik op een tijdslot in de kalender om een openingstijd toe te voegen
        </p>
    </div>

    <OpeningTimeDialog
        v-model:visible="showOpeningDialog"
        :opening-time="openingTime"
        :edit-mode="editMode"
        @save="saveOpeningTime"
        @close="closeDialog">
    </OpeningTimeDialog>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.calendar-wrapper {
    @apply overflow-hidden rounded-lg;
}
</style>
