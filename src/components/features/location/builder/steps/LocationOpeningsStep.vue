<script setup lang="ts">
import OpeningTimeDialog from '@/components/features/location/builder/OpeningTimeDialog.vue';
import OpeningTimeGroupDialog from '@/components/features/location/builder/OpeningTimeGroupDialog.vue';
import OpeningTimesCalendar from '@/components/features/location/builder/OpeningTimesCalendar.vue';
import type { LocationRequest } from '@/domain/location';
import {
    DEFAULT_OPENING_TIME_GROUP_REQUEST,
    DEFAULT_OPENING_TIME_REQUEST,
    type OpeningTimeGroupRequest,
    type OpeningTimeRequest,
} from '@/domain/openingTime';
import type { SubStep } from '@/pages/public/locations/LocationSubmitPage.vue';
import { addToDate } from '@/utils/date/date';
import type { Time } from '@/utils/date/time';
import { addHoursToTime, createTime, parseTimeString, validateTimeRange } from '@/utils/date/time';
import { faRepeat, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Button from 'primevue/button';
import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from 'primevue/useconfirm';
import { ref, watchEffect } from 'vue';

const { form } = defineProps<{
    form: LocationRequest;
}>();

const openings = defineModel<OpeningTimeRequest[]>('openings', {
    default: [],
    required: true,
});

const substeps = defineModel<SubStep[]>('substeps', {
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

function handleSaveOpeningTime(openingTime: OpeningTimeRequest): void {
    const correctedTimes = validateTimeRange(openingTime.startTime, openingTime.endTime);
    openingTime.startTime = correctedTimes.startTime;
    openingTime.endTime = correctedTimes.endTime;

    if (editingIndex.value !== null) {
        openings.value[editingIndex.value] = { ...openingTime };
        // const newTimes = [...openings.value];
        // newTimes[editingIndex.value] = { ...openingTime };
        // openings.value = newTimes;
    } else {
        openings.value.push({ ...openingTime });
    }

    closeDialog();
}

function removeOpeningTime(index: number): void {
    const newTimes = [...openings.value];
    newTimes.splice(index, 1);
    openings.value = newTimes;
}

function handleCalendarSlotClick(slot: { day: Date; time: string }): void {
    const { hours, minutes } = parseTimeString(slot.time);

    const startTime = createTime(hours, minutes);
    const endTime = addHoursToTime(startTime, 1);

    newOpeningTime.value = {
        startTime,
        endTime,
        day: new Date(slot.day),
        seatCount: form.seatCount || 1,
        reservableFrom: null,
        reservableUntil: null,
    };

    showAddDialog.value = true;
}

function handleEditSlot(index: number, slot: OpeningTimeRequest): void {
    newOpeningTime.value = { ...slot };
    editingIndex.value = index;
    showAddDialog.value = true;
}

function handleDeleteSlot(index: number): void {
    removeOpeningTime(index);
}

function handleDragSlot(index: number, updatedSlot: OpeningTimeRequest): void {
    const newTimes = [...openings.value];
    newTimes[index] = updatedSlot;
    openings.value = newTimes;
}

function closeDialog(): void {
    showAddDialog.value = false;
    editingIndex.value = null;
    newOpeningTime.value = DEFAULT_OPENING_TIME_REQUEST;
}

function applyOpeningTimeGroup(openingTimeGroup: OpeningTimeGroupRequest): void {
    const { type, startDate, endDate, selectedDays, timeSlots } = openingTimeGroup;
    const days = type === 'daily' ? [1, 2, 3, 4, 5] : selectedDays;

    const newTimes: OpeningTimeRequest[] = [];

    for (let date = new Date(startDate); date <= endDate; date = addToDate(date, 1, 'day')) {
        const dayOfWeek = date.getDay();
        if (!days.includes(dayOfWeek)) continue;

        timeSlots.forEach((slot: { startTime: Time; endTime: Time; seatCount: number }) => {
            const correctedTimes = validateTimeRange(slot.startTime, slot.endTime);

            newTimes.push({
                startTime: correctedTimes.startTime,
                endTime: correctedTimes.endTime,
                day: new Date(date),
                seatCount: slot.seatCount,
                reservableFrom: null,
                reservableUntil: null,
            });
        });
    }

    openings.value = [...openings.value, ...newTimes];
    showOpeningTimeGroupDialog.value = false;
}

function handleDeleteSlotFromDialog(): void {
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
        <OpeningTimesCalendar
            v-model:date-in-week="currentWeek"
            :opening-times="openings"
            @select:slot="handleCalendarSlotClick"
            @edit:slot="handleEditSlot"
            @delete:slot="handleDeleteSlot"
            @drag:slot="handleDragSlot"
            class="h-96 overflow-visible">
        </OpeningTimesCalendar>

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
                        @click="showOpeningTimeGroupDialog = true"
                        size="small"
                        severity="secondary"
                        outlined>
                        <FontAwesomeIcon :icon="faRepeat" class="mr-2" />
                        Openingstijden groep
                    </Button>

                    <Button
                        v-if="openings.length > 0"
                        @click="confirmClearAll"
                        size="small"
                        severity="danger"
                        outlined>
                        <FontAwesomeIcon :icon="faTrash" class="mr-2" />
                        Alles wissen
                    </Button>
                </div>
            </div>
        </div>
    </div>

    <!-- Opening Time Dialog -->
    <OpeningTimeDialog
        v-model:visible="showAddDialog"
        :opening-time="newOpeningTime"
        :editing-index="editingIndex"
        @save="handleSaveOpeningTime"
        @delete="handleDeleteSlotFromDialog"
        @close="closeDialog">
    </OpeningTimeDialog>

    <!-- Opening Time Group Dialog -->
    <OpeningTimeGroupDialog
        v-model:visible="showOpeningTimeGroupDialog"
        :opening-time-group="newOpeningTimeGroup"
        :default-seat-count="form.seatCount"
        @apply="applyOpeningTimeGroup">
    </OpeningTimeGroupDialog>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.calendar-wrapper {
    @apply overflow-hidden rounded-lg;
}
</style>
