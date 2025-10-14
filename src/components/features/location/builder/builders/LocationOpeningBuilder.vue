<script setup lang="ts">
import OpeningTimeDialog from '@/components/features/location/builder/OpeningTimeDialog.vue';
import OpeningTimesCalendar from '@/components/features/location/builder/OpeningTimesCalendar.vue';
import CalendarControls from '@/components/shared/molecules/calendar/CalendarControls.vue';
import { formatDate } from '@vueuse/core';
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { DEFAULT_OPENING_TIME_REQUEST, type OpeningTimeRequest } from '@/domain/openings';
import type { TimeCell, TimeSlot } from '@/domain/calendar';

defineProps<{
    openingTimes: OpeningTimeRequest[];
}>();

const emit = defineEmits<{
    create: [openingTime: OpeningTimeRequest];
    update: [id: number, openingTime: OpeningTimeRequest, sequence?: boolean];
    delete: [id: number, sequence?: boolean];
}>();

const router = useRouter();
const route = useRoute();

// Calendar state
const dateInWeek = computed(() => {
    const dateParam = route.query.inWeekOf?.toString();
    if (dateParam) {
        const date = new Date(dateParam);
        if (!isNaN(date.getTime())) {
            return date;
        }
    }
    return new Date();
});

const showDialog = ref(false);
const editingOpeningTime = ref<OpeningTimeRequest | null>(null);
const isEditing = ref(false);

/**
 * Updates the date in the URL query parameter
 */
function onDateInWeekUpdate(newDate: Date): void {
    const dateString = formatDate(newDate, 'YYYY-MM-DD');
    router.push({
        name: route.name || undefined,
        params: route.params,
        query: {
            ...route.query,
            inWeekOf: dateString,
        },
    });
}

/**
 * Handles date selection from calendar controls
 */
function onDateSelect(date: Date): void {
    onDateInWeekUpdate(date);
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
        };
    } else {
        editingOpeningTime.value = { ...DEFAULT_OPENING_TIME_REQUEST };
    }

    isEditing.value = false;
    showDialog.value = true;
}

/**
 * Opens the dialog to edit an existing opening time
 */
function onEditClick(slot: TimeSlot<OpeningTimeRequest>): void {
    if (slot.metadata) {
        editingOpeningTime.value = { ...slot.metadata };
        isEditing.value = true;
        showDialog.value = true;
    }
}

/**
 * Handles drag event to update opening time
 */
function onDragSlot(originalSlot: TimeSlot<OpeningTimeRequest>, newSlot: TimeSlot): void {
    const openingTimeId = originalSlot.metadata?.id;

    if (!openingTimeId || !originalSlot.metadata) return;

    const updatedOpeningTime: OpeningTimeRequest = {
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
function onSave(openingTime: OpeningTimeRequest, sequence?: boolean): void {
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
function onDelete(openingTime: OpeningTimeRequest, sequence?: boolean): void {
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
        <CalendarControls :date="dateInWeek" @update:date="onDateSelect" />

        <!-- Calendar view -->
        <OpeningTimesCalendar
            :opening-times="openingTimes"
            :date-in-week="dateInWeek"
            @click:cell="onCellClick"
            @click:slot="onEditClick"
            @drag:slot="onDragSlot">
        </OpeningTimesCalendar>

        <!-- Opening time dialog -->
        <OpeningTimeDialog
            v-model:visible="showDialog"
            :opening-time="editingOpeningTime"
            :is-editing="isEditing"
            @save="onSave"
            @delete="onDelete">
        </OpeningTimeDialog>
    </div>
</template>
