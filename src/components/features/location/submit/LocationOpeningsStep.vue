<script setup lang="ts">
import OpeningTimeDialog from '@/components/features/location/submit/OpeningTimeDialog.vue';
import OpeningTimesCalendar from '@/components/features/location/submit/OpeningTimesCalendar.vue';
import type { CreateLocationRequest, CreateOpeningTimeRequest } from '@/types/schema/Location';
import { addToDate } from '@/utils/date/date';
import {
    faCalendarDays,
    faCalendarPlus,
    faPlus,
    faRepeat,
    faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Button from 'primevue/button';
import Calendar from 'primevue/calendar';
import Card from 'primevue/card';
import Checkbox from 'primevue/checkbox';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import InputNumber from 'primevue/inputnumber';
import { computed, ref, watch } from 'vue';

const form = defineModel<CreateLocationRequest>({ required: true });
const complete = defineModel<boolean>('complete', { default: false });

const openingTimes = computed(() => form.value.openingTimes || []);
const currentWeek = ref(new Date());
const showAddDialog = ref(false);
const showQuickActionsDialog = ref(false);
const editingIndex = ref<number | null>(null);

const newOpeningTime = ref<CreateOpeningTimeRequest>({
    startTime: new Date(),
    endTime: new Date(),
    seatCount: form.value.seatCount || 1,
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
            seatCount: form.value.seatCount || 1,
        },
    ],
});

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

watch(
    [openingTimes],
    ([times]) => {
        complete.value = times.length > 0;
    },
    { immediate: true, deep: true },
);

function handleSaveOpeningTime(openingTime: CreateOpeningTimeRequest): void {
    if (editingIndex.value !== null) {
        // Edit existing opening time
        const newTimes = [...openingTimes.value];
        newTimes[editingIndex.value] = { ...openingTime };
        form.value.openingTimes = newTimes;
    } else {
        // Add new opening time
        form.value.openingTimes = [...openingTimes.value, { ...openingTime }];
    }

    closeDialog();
}

function addOpeningTime(): void {
    if (editingIndex.value !== null) {
        const newTimes = [...openingTimes.value];
        newTimes[editingIndex.value] = { ...newOpeningTime.value };
        form.value.openingTimes = newTimes;
        editingIndex.value = null;
    } else {
        form.value.openingTimes = [...openingTimes.value, { ...newOpeningTime.value }];
    }

    newOpeningTime.value = {
        startTime: new Date(),
        endTime: new Date(),
        seatCount: form.value.seatCount || 1,
        reservableFrom: null,
        reservableUntil: null,
    };

    showAddDialog.value = false;
    editingIndex.value = null;
}

function removeOpeningTime(index: number): void {
    const newTimes = [...openingTimes.value];
    newTimes.splice(index, 1);
    form.value.openingTimes = newTimes;
}

function handleCalendarSlotClick(slot: { day: Date; time: string }): void {
    const [hours, minutes] = slot.time.split(':').map(Number);
    const startTime = new Date(slot.day);
    startTime.setHours(hours, minutes, 0, 0);

    const endTime = new Date(startTime);
    endTime.setHours(hours + 1, minutes, 0, 0);

    newOpeningTime.value = {
        startTime,
        endTime,
        seatCount: form.value.seatCount || 1,
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

function closeDialog(): void {
    showAddDialog.value = false;
    editingIndex.value = null;

    newOpeningTime.value = {
        startTime: new Date(),
        endTime: new Date(),
        seatCount: form.value.seatCount || 1,
        reservableFrom: null,
        reservableUntil: null,
    };
}

function executeQuickAction(): void {
    const newTimes: CreateOpeningTimeRequest[] = [];
    const { type, startDate, endDate, selectedDays, timeSlots } = quickAction.value;

    if (type !== 'weekly' && type !== 'daily') return;

    const days = type === 'daily' ? [1, 2, 3, 4, 5] : selectedDays;

    for (let date = new Date(startDate); date <= endDate; date = addToDate(date, 1, 'day')) {
        const dayOfWeek = date.getDay();

        if (!days.includes(dayOfWeek)) continue;

        timeSlots.forEach((slot) => {
            const startHours = slot.startTime.getHours();
            const startMinutes = slot.startTime.getMinutes();
            const endHours = slot.endTime.getHours();
            const endMinutes = slot.endTime.getMinutes();

            const startTime = new Date(date);
            startTime.setHours(startHours, startMinutes, 0, 0);

            const endTime = new Date(date);
            endTime.setHours(endHours, endMinutes, 0, 0);

            newTimes.push({
                startTime,
                endTime,
                seatCount: slot.seatCount,
                reservableFrom: null,
                reservableUntil: null,
            });
        });
    }

    form.value.openingTimes = [...openingTimes.value, ...newTimes];
    showQuickActionsDialog.value = false;
}

function addTimeSlot(): void {
    quickAction.value.timeSlots.push({
        startTime: new Date('2000-01-01T09:00:00'),
        endTime: new Date('2000-01-01T17:00:00'),
        seatCount: form.value.seatCount || 1,
    });
}

function removeTimeSlot(index: number): void {
    quickAction.value.timeSlots.splice(index, 1);
}
</script>

<template>
    <Card class="border-l-secondary-500 border-l-4">
        <template #content>
            <div class="space-y-6 p-6">
                <!-- Header -->
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <div
                            class="bg-secondary-100 flex h-10 w-10 items-center justify-center rounded-full">
                            <FontAwesomeIcon :icon="faCalendarDays" class="text-secondary-600" />
                        </div>
                        <div>
                            <h3 class="text-xl font-semibold text-gray-900">Openingstijden</h3>
                            <p class="text-sm text-gray-600">
                                Plan wanneer uw locatie beschikbaar is
                                <span class="ml-2 text-gray-500">
                                    ({{ openingTimes.length }} tijdsloten)
                                </span>
                            </p>
                        </div>
                    </div>

                    <div class="flex items-center gap-2">
                        <Button
                            @click="showQuickActionsDialog = true"
                            size="small"
                            severity="secondary"
                            outlined>
                            <FontAwesomeIcon :icon="faRepeat" class="mr-1" />
                            Snelle Acties
                        </Button>

                        <Button
                            v-if="openingTimes.length > 0"
                            @click="form.openingTimes = []"
                            severity="danger"
                            rounded
                            text>
                            <FontAwesomeIcon :icon="faTrash" />
                        </Button>
                    </div>
                </div>
            </div>
        </template>
    </Card>

    <div class="space-y-4">
        <OpeningTimesCalendar
            v-model:date-in-week="currentWeek"
            :opening-times="openingTimes"
            @select:slot="handleCalendarSlotClick"
            @edit:slot="handleEditSlot"
            @delete:slot="handleDeleteSlot"
            class="h-96">
        </OpeningTimesCalendar>

        <p class="text-center text-sm text-gray-500">
            Klik op een tijdslot in de kalender om een openingstijd toe te voegen
        </p>
    </div>

    <!-- Opening Time Dialog -->
    <OpeningTimeDialog
        v-model:visible="showAddDialog"
        :opening-time="newOpeningTime"
        :editing-index="editingIndex"
        @save="handleSaveOpeningTime"
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
                    <Calendar v-model="quickAction.startDate" class="w-full" />
                </div>
                <div>
                    <label class="mb-2 block text-sm font-medium text-gray-700">Eind Datum</label>
                    <Calendar v-model="quickAction.endDate" class="w-full" />
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
                                v-model="slot.startTime"
                                show-time
                                time-only
                                hour-format="24"
                                class="w-full" />
                        </div>
                        <div class="flex-1">
                            <label class="mb-1 block text-xs text-gray-500">Eind</label>
                            <Calendar
                                v-model="slot.endTime"
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
