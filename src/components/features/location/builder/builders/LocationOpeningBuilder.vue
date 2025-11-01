<script setup lang="ts">
import OpeningBuilderDialog from '@/components/features/openings/builder/OpeningBuilderDialog.vue';
import OpeningsBuilderCalendar from '@/components/features/openings/builder/OpeningsBuilderCalendar.vue';
import CalendarControls from '@/components/shared/molecules/calendar/CalendarControls.vue';
import { ref } from 'vue';
import { useRouteDate } from '@/composables/useRouteDate';
import { DEFAULT_OPENING_TIME_REQUEST, type OpeningTimeBody } from '@/domain/openings';
import type { TimeCell, TimeSlot } from '@/domain/calendar';
import type { Location } from '@/domain/location';

const props = defineProps<{
    location: Location;
    openingTimes: OpeningTimeBody[];
}>();

const emit = defineEmits<{
    create: [openingTime: OpeningTimeBody];
    update: [id: number, openingTime: OpeningTimeBody, sequence?: boolean];
    delete: [id: number, sequence?: boolean];
}>();

const inWeekOf = useRouteDate({ paramName: 'inWeekOf', updateMethod: 'push' });

const showDialog = ref(false);
const editingOpeningTime = ref<OpeningTimeBody | null>(null);
const isEditing = ref(false);

/**
 * Handles date selection from calendar controls
 */
function onDateSelect(date: Date): void {
    inWeekOf.value = date;
}

/**
 * Opens the dialog to create a new opening time
 */
function onCreateClick(timeCell?: TimeCell): void {
    if (timeCell) {
        editingOpeningTime.value = {
            ...DEFAULT_OPENING_TIME_REQUEST,
            day: timeCell.day,
            startTime: timeCell.startTime,
            endTime: timeCell.endTime,
            seatCount: props.location.seatCount,
        };
    } else {
        editingOpeningTime.value = {
            ...DEFAULT_OPENING_TIME_REQUEST,
            seatCount: props.location.seatCount,
        };
    }

    isEditing.value = false;
    showDialog.value = true;
}

/**
 * Opens the dialog to edit an existing opening time
 */
function onEditClick(slot: TimeSlot<OpeningTimeBody>): void {
    if (slot.metadata) {
        editingOpeningTime.value = { ...slot.metadata };
        isEditing.value = true;
        showDialog.value = true;
    }
}

/**
 * Handles drag event to update opening time
 */
function onDragSlot(originalSlot: TimeSlot<OpeningTimeBody>, newSlot: TimeSlot): void {
    const openingTimeId = originalSlot.metadata?.id;

    if (!openingTimeId || !originalSlot.metadata) return;

    const updatedOpeningTime: OpeningTimeBody = {
        ...originalSlot.metadata,
        day: newSlot.day,
        startTime: newSlot.startTime,
        endTime: newSlot.endTime,
    };

    emit('update', openingTimeId, updatedOpeningTime);
}

/**
 * Handles saving (create/update) an opening time
 */
function onSave(openingTime: OpeningTimeBody, sequence?: boolean): void {
    if (isEditing.value) {
        if (!openingTime.id) return;
        emit('update', openingTime.id, openingTime, sequence);
    } else {
        emit('create', openingTime);
    }

    showDialog.value = false;
}

/**
 * Handles deletion of an opening time
 */
function onDelete(openingTime: OpeningTimeBody, sequence?: boolean): void {
    if (!openingTime.id) return;
    emit('delete', openingTime.id, sequence);
    showDialog.value = false;
}

/**
 * Opens the create dialog when clicking on an empty cell
 */
function onCellClick(timeCell: TimeCell): void {
    onCreateClick(timeCell);
}
</script>

<template>
    <div class="space-y-6">
        <!-- Calendar controls -->
        <CalendarControls :date="inWeekOf" @update:date="onDateSelect" />

        <!-- Calendar view -->
        <OpeningsBuilderCalendar
            :opening-times="openingTimes"
            :in-week-of="inWeekOf"
            @click:cell="onCellClick"
            @click:slot="onEditClick"
            @drag:slot="onDragSlot">
        </OpeningsBuilderCalendar>

        <!-- Opening time dialog -->
        <OpeningBuilderDialog
            v-model:visible="showDialog"
            :opening-time="editingOpeningTime"
            :is-editing="isEditing"
            @save="onSave"
            @delete="onDelete">
        </OpeningBuilderDialog>
    </div>
</template>
