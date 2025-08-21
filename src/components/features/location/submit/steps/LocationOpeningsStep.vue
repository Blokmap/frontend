<script setup lang="ts">
import OpeningTimeDialog from '@/components/features/location/submit/OpeningTimeDialog.vue';
import OpeningTimesCalendar from '@/components/features/location/submit/OpeningTimesCalendar.vue';
import type { SubStep } from '@/types/contract/LocationWizard';
import type { CreateLocationRequest, CreateOpeningTimeRequest } from '@/types/schema/Location';
import { addToDate } from '@/utils/date/date';
import { parseTimeString } from '@/utils/date/time';
import { faCalendarPlus, faPlus, faRepeat, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Button from 'primevue/button';
import Calendar from 'primevue/calendar';
import Checkbox from 'primevue/checkbox';
import ConfirmDialog from 'primevue/confirmdialog';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import InputNumber from 'primevue/inputnumber';
import { useConfirm } from 'primevue/useconfirm';
import { computed, ref, watch, watchEffect } from 'vue';

const { form } = defineProps<{
    form: CreateLocationRequest;
}>();

const openings = defineModel<CreateOpeningTimeRequest[]>('openings', { default: [] });
const substeps = defineModel<SubStep[]>('substeps', { default: [] });

const confirm = useConfirm();

const openingTimes = computed(() => openings.value || []);
const currentWeek = ref(new Date());
const showAddDialog = ref(false);
const showQuickActionsDialog = ref(false);
const editingIndex = ref<number | null>(null);

const today = new Date();
today.setHours(0, 0, 0, 0);

const maxDate = new Date();
maxDate.setMonth(maxDate.getMonth() + 2);
maxDate.setHours(23, 59, 59, 999);

const newOpeningTime = ref<CreateOpeningTimeRequest>({
    startTime: new Date('2000-01-01T09:00:00'),
    endTime: new Date('2000-01-01T10:00:00'),
    day: new Date(),
    seatCount: form.seatCount || 1,
    reservableFrom: null,
    reservableUntil: null,
});

const quickAction = ref({
    type: 'weekly',
    startDate: new Date(),
    endDate: addToDate(new Date(), 4, 'week'),
    selectedDays: [1, 2, 3, 4, 5],
    timeSlots: [
        {
            startTime: new Date('2000-01-01T09:00:00'),
            endTime: new Date('2000-01-01T17:00:00'),
            seatCount: form.seatCount || 1,
        },
    ],
});

// Ensure quick action dates stay within constraints
watch(
    () => quickAction.value.startDate,
    (newStartDate) => {
        if (newStartDate < today) {
            quickAction.value.startDate = new Date(today);
        }
        if (newStartDate > maxDate) {
            quickAction.value.startDate = new Date(maxDate);
        }
    },
);

watch(
    () => quickAction.value.endDate,
    (newEndDate) => {
        if (newEndDate < today) {
            quickAction.value.endDate = new Date(today);
        }
        if (newEndDate > maxDate) {
            quickAction.value.endDate = new Date(maxDate);
        }
    },
);

const dayOptions = [
    { label: 'Maandag', value: 1 },
    { label: 'Dinsdag', value: 2 },
    { label: 'Woensdag', value: 3 },
    { label: 'Donderdag', value: 4 },
    { label: 'Vrijdag', value: 5 },
    { label: 'Zaterdag', value: 6 },
    { label: 'Zondag', value: 0 },
];

const quickActionTypes = [
    { label: 'Wekelijks patroon', value: 'weekly' },
    { label: 'Dagelijks (doordeweeks)', value: 'daily' },
];

watchEffect(() => {
    const times = openingTimes.value;
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

function handleSaveOpeningTime(openingTime: CreateOpeningTimeRequest): void {
    // Compare times on the same day for validation
    if (openingTime.endTime.getTime() <= openingTime.startTime.getTime()) {
        const correctedEndTime = new Date(openingTime.startTime);
        correctedEndTime.setHours(correctedEndTime.getHours() + 1);
        openingTime.endTime = correctedEndTime;
    }

    if (editingIndex.value !== null) {
        const newTimes = [...openingTimes.value];
        newTimes[editingIndex.value] = { ...openingTime };
        openings.value = newTimes;
    } else {
        openings.value = [...openingTimes.value, { ...openingTime }];
    }

    closeDialog();
}

function removeOpeningTime(index: number): void {
    const newTimes = [...openingTimes.value];
    newTimes.splice(index, 1);
    openings.value = newTimes;
}

function handleCalendarSlotClick(slot: { day: Date; time: string }): void {
    if (slot.day < today) return;
    if (slot.day > maxDate) return;

    const { hours, minutes } = parseTimeString(slot.time);

    // Create time-only dates
    const startTime = new Date('2000-01-01');
    startTime.setHours(hours, minutes, 0, 0);

    const endTime = new Date('2000-01-01');
    endTime.setHours(hours + 1, minutes, 0, 0);

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

function handleEditSlot(index: number, slot: CreateOpeningTimeRequest): void {
    newOpeningTime.value = { ...slot };
    editingIndex.value = index;
    showAddDialog.value = true;
}

function handleDeleteSlot(index: number): void {
    removeOpeningTime(index);
}

function handleDragSlot(index: number, updatedSlot: CreateOpeningTimeRequest): void {
    const newTimes = [...openingTimes.value];
    newTimes[index] = updatedSlot;
    openings.value = newTimes;
}

function closeDialog(): void {
    showAddDialog.value = false;
    editingIndex.value = null;

    newOpeningTime.value = {
        startTime: new Date('2000-01-01T09:00:00'),
        endTime: new Date('2000-01-01T10:00:00'),
        day: new Date(),
        seatCount: form.seatCount || 1,
        reservableFrom: null,
        reservableUntil: null,
    };
}

function executeQuickAction(): void {
    const newTimes: CreateOpeningTimeRequest[] = [];
    const { type, startDate, endDate, selectedDays, timeSlots } = quickAction.value;

    if (type !== 'weekly' && type !== 'daily') return;

    const days = type === 'daily' ? [1, 2, 3, 4, 5] : selectedDays;

    // Ensure dates are within constraints
    const constrainedStartDate = new Date(Math.max(startDate.getTime(), today.getTime()));
    const constrainedEndDate = new Date(Math.min(endDate.getTime(), maxDate.getTime()));

    for (
        let date = new Date(constrainedStartDate);
        date <= constrainedEndDate;
        date = addToDate(date, 1, 'day')
    ) {
        const dayOfWeek = date.getDay();

        if (!days.includes(dayOfWeek)) continue;

        timeSlots.forEach((slot) => {
            const startHours = slot.startTime.getHours();
            const startMinutes = slot.startTime.getMinutes();
            const endHours = slot.endTime.getHours();
            const endMinutes = slot.endTime.getMinutes();

            // Create time-only dates
            const startTime = new Date('2000-01-01');
            startTime.setHours(startHours, startMinutes, 0, 0);

            const endTime = new Date('2000-01-01');
            endTime.setHours(endHours, endMinutes, 0, 0);

            // Validate that end time is after start time
            if (endTime <= startTime) {
                endTime.setHours(startHours + 1, startMinutes, 0, 0);
            }

            newTimes.push({
                startTime,
                endTime,
                day: new Date(date),
                seatCount: slot.seatCount,
                reservableFrom: null,
                reservableUntil: null,
            });
        });
    }

    openings.value = [...openingTimes.value, ...newTimes];
    showQuickActionsDialog.value = false;
}

function addTimeSlot(): void {
    quickAction.value.timeSlots.push({
        startTime: new Date('2000-01-01T09:00:00'),
        endTime: new Date('2000-01-01T17:00:00'),
        seatCount: form.seatCount || 1,
    });
}

function removeTimeSlot(index: number): void {
    quickAction.value.timeSlots.splice(index, 1);
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

function getTimeSlotStartTime(slot: { startTime: Date; endTime: Date; seatCount: number }): Date {
    return slot.startTime instanceof Date ? new Date(slot.startTime) : new Date(slot.startTime);
}

function setTimeSlotStartTime(
    slot: { startTime: Date; endTime: Date; seatCount: number },
    value: Date,
): void {
    if (value instanceof Date) {
        slot.startTime = new Date(value);
    }
}

function getTimeSlotEndTime(slot: { startTime: Date; endTime: Date; seatCount: number }): Date {
    return slot.endTime instanceof Date ? new Date(slot.endTime) : new Date(slot.endTime);
}

function setTimeSlotEndTime(
    slot: { startTime: Date; endTime: Date; seatCount: number },
    value: Date,
): void {
    if (value instanceof Date) {
        slot.endTime = new Date(value);
    }
}
</script>

<template>
    <ConfirmDialog />
    <div class="space-y-4 pb-20">
        <OpeningTimesCalendar
            v-model:date-in-week="currentWeek"
            :opening-times="openingTimes"
            :min-date="today"
            :max-date="maxDate"
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
                        @click="showQuickActionsDialog = true"
                        size="small"
                        severity="secondary"
                        outlined>
                        <FontAwesomeIcon :icon="faRepeat" class="mr-2" />
                        Snelle acties
                    </Button>

                    <Button
                        v-if="openingTimes.length > 0"
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
        :min-date="today"
        :max-date="maxDate"
        @save="handleSaveOpeningTime"
        @delete="handleDeleteSlotFromDialog"
        @close="closeDialog" />

    <!-- Quick Actions Dialog -->
    <Dialog
        v-model:visible="showQuickActionsDialog"
        header="Snelle Acties"
        :style="{ width: '600px' }"
        modal
        :draggable="false"
        :resizable="false">
        <div class="space-y-6">
            <div>
                <label class="mb-2 block text-sm font-medium text-gray-700">Type</label>
                <Dropdown
                    v-model="quickAction.type"
                    :options="quickActionTypes"
                    option-label="label"
                    option-value="value"
                    class="w-full">
                </Dropdown>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="mb-2 block text-sm font-medium text-gray-700">Start Datum</label>
                    <Calendar
                        v-model="quickAction.startDate"
                        :min-date="today"
                        :max-date="maxDate"
                        class="w-full" />
                </div>
                <div>
                    <label class="mb-2 block text-sm font-medium text-gray-700">Eind Datum</label>
                    <Calendar
                        v-model="quickAction.endDate"
                        :min-date="today"
                        :max-date="maxDate"
                        class="w-full" />
                </div>
            </div>

            <div v-if="quickAction.type === 'weekly'">
                <label class="mb-2 block text-sm font-medium text-gray-700">Dagen</label>
                <div class="flex flex-wrap gap-2">
                    <div v-for="day in dayOptions" :key="day.value" class="flex items-center gap-2">
                        <Checkbox v-model="quickAction.selectedDays" :value="day.value" />
                        <label class="text-sm">{{ day.label }}</label>
                    </div>
                </div>
            </div>

            <div>
                <div class="mb-2 flex items-center justify-between">
                    <label class="text-sm font-medium text-gray-700">Tijdsloten</label>
                    <Button @click="addTimeSlot" size="small" outlined>
                        <FontAwesomeIcon :icon="faPlus" class="mr-1" />
                        Tijdslot
                    </Button>
                </div>

                <div class="space-y-3">
                    <div
                        v-for="(slot, index) in quickAction.timeSlots"
                        :key="index"
                        class="flex items-center gap-3">
                        <div class="flex-1">
                            <label class="mb-1 block text-xs text-gray-500">Start</label>
                            <Calendar
                                :model-value="getTimeSlotStartTime(slot)"
                                @update:model-value="
                                    (value: Date) => setTimeSlotStartTime(slot, value)
                                "
                                show-time
                                time-only
                                hour-format="24"
                                class="w-full" />
                        </div>
                        <div class="flex-1">
                            <label class="mb-1 block text-xs text-gray-500">Eind</label>
                            <Calendar
                                :model-value="getTimeSlotEndTime(slot)"
                                @update:model-value="
                                    (value: Date) => setTimeSlotEndTime(slot, value)
                                "
                                show-time
                                time-only
                                hour-format="24"
                                class="w-full">
                            </Calendar>
                        </div>
                        <div class="flex-1">
                            <label class="mb-1 block text-xs text-gray-500">Stoelen</label>
                            <InputNumber v-model="slot.seatCount" :min="1" class="w-full" />
                        </div>
                        <Button
                            v-if="quickAction.timeSlots.length > 1"
                            @click="removeTimeSlot(index)"
                            size="small"
                            severity="danger"
                            outlined>
                            <FontAwesomeIcon :icon="faTrash" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>

        <template #footer>
            <div class="flex justify-end gap-3">
                <Button
                    @click="showQuickActionsDialog = false"
                    severity="secondary"
                    outlined
                    size="small">
                    Annuleren
                </Button>
                <Button @click="executeQuickAction" size="small">
                    <FontAwesomeIcon :icon="faCalendarPlus" class="mr-2" />
                    Toepassen
                </Button>
            </div>
        </template>
    </Dialog>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.calendar-wrapper {
    @apply overflow-hidden rounded-lg;
}
</style>
