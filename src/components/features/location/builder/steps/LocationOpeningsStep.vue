<script setup lang="ts">
import Button from 'primevue/button';
import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from 'primevue/useconfirm';
import OpeningTimeDialog from '@/components/features/location/builder/OpeningTimeDialog.vue';
import OpeningTimeGroupDialog from '@/components/features/location/builder/OpeningTimeGroupDialog.vue';
import OpeningTimesCalendar from '@/components/features/location/builder/OpeningTimesCalendar.vue';
import CalendarControls from '@/components/shared/calendar/CalendarControls.vue';
import { faRepeat, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ref, watchEffect } from 'vue';
import {
    DEFAULT_OPENING_TIME_GROUP_REQUEST,
    DEFAULT_OPENING_TIME_REQUEST,
    type OpeningTimeGroupRequest,
    type OpeningTimeRequest,
    getOpeningsFromGroup,
    TimeCell,
} from '@/domain/openings';
import { addToTime, validateTimeRange } from '@/utils/date/time';
import type { BuilderSubstep, LocationRequest } from '@/domain/location';

const { form } = defineProps<{
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

const confirm = useConfirm();

const currentWeek = ref(new Date());
const editingIndex = ref<number | null>(null);
const showAddDialog = ref(false);
const showOpeningTimeGroupDialog = ref(false);

const newOpeningTime = ref<OpeningTimeRequest>(DEFAULT_OPENING_TIME_REQUEST);
const newOpeningTimeGroup = ref<OpeningTimeGroupRequest>(DEFAULT_OPENING_TIME_GROUP_REQUEST);

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

function saveOpeningTime(openingTime: OpeningTimeRequest): void {
    const correctedTimes = validateTimeRange(openingTime.startTime, openingTime.endTime);
    openingTime.startTime = correctedTimes.startTime;
    openingTime.endTime = correctedTimes.endTime;

    if (editingIndex.value !== null) {
        const newTimes = [...openings.value];
        newTimes[editingIndex.value] = { ...openingTime };
        openings.value = newTimes;
    } else {
        openings.value = [...openings.value, { ...openingTime }];
    }

    closeDialog();
}

function removeOpeningTime(index: number): void {
    const newTimes = [...openings.value];
    newTimes.splice(index, 1);
    openings.value = newTimes;
}

function onCalendarSlotClick(timeCell: TimeCell): void {
    const startTime = timeCell.startTime;
    const endTime = addToTime(startTime, 1, 'hours');

    newOpeningTime.value = {
        startTime,
        endTime,
        day: new Date(timeCell.day),
        seatCount: form.seatCount || 1,
        reservableFrom: null,
        reservableUntil: null,
    };

    showAddDialog.value = true;
}

function onEditSlot(index: number, slot: OpeningTimeRequest): void {
    newOpeningTime.value = { ...slot };
    editingIndex.value = index;
    showAddDialog.value = true;
}

function onDragSlot(index: number, updatedSlot: OpeningTimeRequest): void {
    console.log('Dragged slot:', updatedSlot);
    const newTimes = [...openings.value];
    newTimes[index] = updatedSlot;
    openings.value = newTimes;
}

function closeDialog(): void {
    showAddDialog.value = false;
    editingIndex.value = null;
    newOpeningTime.value = DEFAULT_OPENING_TIME_REQUEST;
}

function goToPreviousWeek(): void {
    const newDate = new Date(currentWeek.value);
    newDate.setDate(newDate.getDate() - 7);
    currentWeek.value = newDate;
}

function goToNextWeek(): void {
    const newDate = new Date(currentWeek.value);
    newDate.setDate(newDate.getDate() + 7);
    currentWeek.value = newDate;
}

function goToToday(): void {
    currentWeek.value = new Date();
}

function handleDateSelect(date: any): void {
    if (date instanceof Date) {
        currentWeek.value = date;
    }
}

function saveOpeningGroup(openingTimeGroup: OpeningTimeGroupRequest): void {
    const newOpenings = getOpeningsFromGroup(openingTimeGroup);
    openings.value = [...openings.value, ...newOpenings];
    showOpeningTimeGroupDialog.value = false;
}

function deleteFromDialog(): void {
    if (editingIndex.value !== null) {
        removeOpeningTime(editingIndex.value);
        closeDialog();
    }
}

function confirmClearAll(): void {
    confirm.require({
        message:
            'Weet je zeker dat je alle openingstijden wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.',
        header: 'Alle openingstijden verwijderen',
        rejectProps: {
            label: 'Annuleren',
            severity: 'secondary',
            outlined: true,
        },
        acceptProps: {
            label: 'Verwijderen',
            severity: 'danger',
        },
        accept: () => {
            openings.value = [];
        },
    });
}
</script>

<template>
    <ConfirmDialog />

    <div class="space-y-4 pb-20">
        <div class="flex flex-col space-y-6 overflow-visible">
            <CalendarControls
                :current-week="currentWeek"
                @click:previous-week="goToPreviousWeek"
                @click:next-week="goToNextWeek"
                @click:current-week="goToToday"
                @select:date="handleDateSelect" />

            <div class="flex-1">
                <OpeningTimesCalendar
                    v-model:date-in-week="currentWeek"
                    :opening-times="openings"
                    @select:slot="onCalendarSlotClick"
                    @edit:slot="onEditSlot"
                    @delete:slot="removeOpeningTime"
                    @drag:slot="onDragSlot" />
            </div>
        </div>

        <p class="text-center text-sm text-gray-500">
            Klik op een tijdslot in de kalender om een openingstijd toe te voegen
        </p>
    </div>

    <!-- Sticky Bottom Action Bar -->
    <div class="fixed right-0 bottom-0 left-0 z-30">
        <div
            class="mx-3 mb-3 rounded-lg border border-slate-200 bg-white/95 shadow-lg backdrop-blur-sm md:mx-6">
            <div class="px-4 py-3">
                <div class="flex items-center justify-between">
                    <Button
                        size="small"
                        severity="secondary"
                        outlined
                        @click="showOpeningTimeGroupDialog = true">
                        <FontAwesomeIcon :icon="faRepeat" class="mr-2" />
                        Openingstijden groep
                    </Button>

                    <Button
                        v-if="openings.length > 0"
                        size="small"
                        severity="danger"
                        outlined
                        @click="confirmClearAll">
                        <FontAwesomeIcon :icon="faTrash" class="mr-2" />
                        Alles wissen
                    </Button>
                </div>
            </div>
        </div>
    </div>

    <OpeningTimeDialog
        v-model:visible="showAddDialog"
        :opening-time="newOpeningTime"
        :editing-index="editingIndex"
        @save="saveOpeningTime"
        @delete="deleteFromDialog"
        @close="closeDialog" />

    <OpeningTimeGroupDialog
        v-model:visible="showOpeningTimeGroupDialog"
        :opening-time-group="newOpeningTimeGroup"
        :default-seat-count="form.seatCount"
        @apply="saveOpeningGroup" />
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.calendar-wrapper {
    @apply overflow-hidden rounded-lg;
}
</style>
