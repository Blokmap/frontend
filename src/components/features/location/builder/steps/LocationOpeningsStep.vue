<script setup lang="ts">
import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from 'primevue/useconfirm';
import OpeningTimeDialog from '@/components/features/location/builder/OpeningTimeDialog.vue';
import OpeningTimesCalendar from '@/components/features/location/builder/OpeningTimesCalendar.vue';
import CalendarControls from '@/components/shared/molecules/calendar/CalendarControls.vue';
import { ref, watchEffect } from 'vue';
import {
    areOpeningTimesOverlapping,
    DEFAULT_OPENING_TIME_REQUEST,
    DEFAULT_REPETITION_CONFIG,
    getOpeningsFromRepetition,
    type OpeningTimeRequest,
    type TimeCell,
} from '@/domain/openings';
import { addToTime } from '@/utils/date/time';
import type { BuilderSubstep, LocationRequest } from '@/domain/location';

type EditMode = 'add' | 'edit-single' | 'edit-group';

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

const currentWeek = ref(new Date());
const editingIndex = ref<number | null>(null);
const editingSequenceNumber = ref<number | null>(null);
const editMode = ref<EditMode>('add');
const showAddDialog = ref(false);
const openingTime = ref<OpeningTimeRequest | null>(null);
const confirm = useConfirm();

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
    let newOpeningTimes: OpeningTimeRequest[] = [];

    // Generate opening times (single or from repetition)
    if (openingTime.repetition?.enabled) {
        const repetitionOpeningTimes = getOpeningsFromRepetition(openingTime);
        newOpeningTimes.push(...repetitionOpeningTimes);
    } else {
        newOpeningTimes.push(openingTime);
    }

    switch (editMode.value) {
        case 'add':
            handleAddOpeningTimes(newOpeningTimes);
            break;
        case 'edit-single':
            handleEditSingleOpeningTime(newOpeningTimes[0]);
            break;
        case 'edit-group':
            handleEditGroupOpeningTimes(newOpeningTimes);
            break;
    }

    closeDialog();
}

function handleAddOpeningTimes(newOpeningTimes: OpeningTimeRequest[]): void {
    let currentOpenings = [...openings.value];

    for (const time of newOpeningTimes) {
        // Assign a new sequence number for new opening times
        time.sequenceNumber = getNextSequenceNumber();

        // Remove any overlapping times
        currentOpenings = currentOpenings.filter(
            (existing) => !areOpeningTimesOverlapping(existing, time),
        );

        currentOpenings.push(time);
    }

    openings.value = currentOpenings;
}

function handleEditSingleOpeningTime(updatedOpeningTime: OpeningTimeRequest): void {
    if (editingIndex.value === null) return;

    const updatedOpenings = [...openings.value];
    updatedOpenings[editingIndex.value] = updatedOpeningTime;
    openings.value = updatedOpenings;
}

function handleEditGroupOpeningTimes(newOpeningTimes: OpeningTimeRequest[]): void {
    if (editingSequenceNumber.value === null) return;

    // Remove all opening times with the same sequence number
    const updatedOpenings = openings.value.filter(
        (time) => time.sequenceNumber !== editingSequenceNumber.value,
    );

    // Add new opening times with the same sequence number
    for (const time of newOpeningTimes) {
        time.sequenceNumber = editingSequenceNumber.value;
    }

    openings.value = [...updatedOpenings, ...newOpeningTimes];
}

function getNextSequenceNumber(): number {
    if (openings.value.length === 0) return 1;
    return Math.max(...openings.value.map((time) => time.sequenceNumber || 0)) + 1;
}

function removeOpeningTime(index: number): void {
    const newTimes = [...openings.value];
    newTimes.splice(index, 1);
    openings.value = newTimes;
}

function onCalendarSlotClick(timeCell: TimeCell): void {
    const startTime = timeCell.startTime;
    const endTime = addToTime(startTime, 1, 'hours');

    editMode.value = 'add';
    editingIndex.value = null;
    editingSequenceNumber.value = null;

    openingTime.value = {
        ...DEFAULT_OPENING_TIME_REQUEST,
        startTime,
        endTime,
        day: new Date(timeCell.day),
        seatCount: form.seatCount || 1,
        sequenceNumber: 0, // Will be assigned in handleAddOpeningTimes
        repetition: {
            enabled: false, // Ensure repetition is disabled by default for new slots
            selectedDays: [...DEFAULT_REPETITION_CONFIG.selectedDays],
            endDate: new Date(DEFAULT_REPETITION_CONFIG.endDate),
        },
    };

    showAddDialog.value = true;
}

function onEditSlot(index: number, slot: OpeningTimeRequest): void {
    // Check if this slot is part of a group (same sequence number)
    const groupSlots = openings.value.filter(
        (time) => (time.sequenceNumber === slot.sequenceNumber && time.sequenceNumber) || 0 > 0,
    );

    if (groupSlots.length > 1) {
        // Ask user if they want to edit the entire group
        confirm.require({
            message: `Deze openingstijd is onderdeel van een groep van ${groupSlots.length} tijden. Wilt u de hele groep bewerken?`,
            header: 'Groep Bewerken',
            rejectProps: {
                label: 'Alleen deze',
                severity: 'secondary',
                outlined: true,
            },
            acceptProps: {
                label: 'Hele groep',
                severity: 'primary',
            },
            accept: () => {
                startGroupEdit(slot);
            },
            reject: () => {
                startSingleEdit(index, slot);
            },
        });
    } else {
        startSingleEdit(index, slot);
    }
}

function startSingleEdit(index: number, slot: OpeningTimeRequest): void {
    editMode.value = 'edit-single';
    editingIndex.value = index;
    editingSequenceNumber.value = null;
    openingTime.value = { ...slot };
    showAddDialog.value = true;
}

function startGroupEdit(slot: OpeningTimeRequest): void {
    editMode.value = 'edit-group';
    editingIndex.value = null;
    editingSequenceNumber.value = slot.sequenceNumber;

    // For group editing, we want to show the base template with repetition enabled
    // Find the earliest slot in the group to use as the base
    const groupSlots = openings.value.filter((time) => time.sequenceNumber === slot.sequenceNumber);

    const sortedSlots = groupSlots.sort((a, b) => a.day.getTime() - b.day.getTime());
    const baseSlot = sortedSlots[0];

    // Create a template with repetition enabled
    openingTime.value = {
        ...baseSlot,
        repetition: {
            enabled: true,
            selectedDays: getSelectedDaysFromGroup(groupSlots),
            endDate: sortedSlots[sortedSlots.length - 1].day,
        },
    };

    showAddDialog.value = true;
}

function getSelectedDaysFromGroup(groupSlots: OpeningTimeRequest[]): number[] {
    const selectedDays = new Set<number>();

    groupSlots.forEach((slot) => {
        // Convert to European day format (0 = Monday, 6 = Sunday)
        const day = (slot.day.getDay() + 6) % 7;
        selectedDays.add(day);
    });

    return Array.from(selectedDays).sort();
}

function onDragSlot(index: number, updatedSlot: OpeningTimeRequest): void {
    // Check for overlaps with other times (excluding the one being dragged)
    const otherTimes = openings.value.filter((_, i) => i !== index);
    const hasOverlap = otherTimes.some((time) => areOpeningTimesOverlapping(time, updatedSlot));

    if (hasOverlap) {
        return;
    }

    // No overlap, safe to update
    const newTimes = [...openings.value];
    newTimes[index] = updatedSlot;
    openings.value = newTimes;
}

function closeDialog(): void {
    showAddDialog.value = false;
    editMode.value = 'add';
    editingIndex.value = null;
    editingSequenceNumber.value = null;
    // Don't reset openingTime here - let it be reset when opening the next dialog
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

function onDateSelect(date: any): void {
    if (date instanceof Date) {
        currentWeek.value = date;
    }
}

function deleteFromDialog(): void {
    switch (editMode.value) {
        case 'edit-single':
            if (editingIndex.value !== null) {
                removeOpeningTime(editingIndex.value);
                closeDialog();
            }
            break;

        case 'edit-group':
            if (editingSequenceNumber.value !== null) {
                deleteGroup(editingSequenceNumber.value);
            }
            break;

        default:
            // Should not happen in delete mode, but handle gracefully
            closeDialog();
            break;
    }
}

function deleteGroup(sequenceNumber: number): void {
    const groupSlots = openings.value.filter((time) => time.sequenceNumber === sequenceNumber);

    if (groupSlots.length > 1) {
        confirm.require({
            message: `Wilt u alle ${groupSlots.length} openingstijden in deze groep verwijderen?`,
            header: 'Groep Verwijderen',
            icon: 'pi pi-exclamation-triangle',
            rejectProps: {
                label: 'Annuleren',
                severity: 'secondary',
                outlined: true,
            },
            acceptProps: {
                label: 'Verwijder alles',
                severity: 'danger',
            },
            accept: () => {
                openings.value = openings.value.filter(
                    (time) => time.sequenceNumber !== sequenceNumber,
                );
                closeDialog();
            },
        });
    } else {
        // Single item, delete directly
        openings.value = openings.value.filter((time) => time.sequenceNumber !== sequenceNumber);
        closeDialog();
    }
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
                @select:date="onDateSelect">
            </CalendarControls>

            <div class="flex-1">
                <OpeningTimesCalendar
                    v-model:date-in-week="currentWeek"
                    :opening-times="openings"
                    @select:slot="onCalendarSlotClick"
                    @edit:slot="onEditSlot"
                    @delete:slot="removeOpeningTime"
                    @drag:slot="onDragSlot">
                </OpeningTimesCalendar>
            </div>
        </div>

        <p class="text-center text-sm text-gray-500">
            Klik op een tijdslot in de kalender om een openingstijd toe te voegen
        </p>
    </div>

    <OpeningTimeDialog
        v-model:visible="showAddDialog"
        :opening-time="openingTime"
        :is-editing="editMode !== 'add'"
        @save="saveOpeningTime"
        @delete="deleteFromDialog"
        @close="closeDialog">
    </OpeningTimeDialog>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.calendar-wrapper {
    @apply overflow-hidden rounded-lg;
}
</style>
