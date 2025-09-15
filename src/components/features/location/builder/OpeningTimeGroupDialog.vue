<script setup lang="ts">
import Button from 'primevue/button';
import Calendar from 'primevue/calendar';
import Checkbox from 'primevue/checkbox';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import InputNumber from 'primevue/inputnumber';

import { faCalendarPlus, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, ref, watch } from 'vue';

import { i18n } from '@/config/locale';
import { dateToTime, timeToDate } from '@/utils/date/time';

import type { OpeningTimeGroupRequest, Time } from '@/domain/openings';

const props = defineProps<{
    openingTimeGroup: OpeningTimeGroupRequest;
    defaultSeatCount?: number;
}>();

const visible = defineModel<boolean>('visible', {
    default: false,
});

const emit = defineEmits<{
    apply: [openingTimeGroup: OpeningTimeGroupRequest];
}>();

const localOpeningTimeGroup = ref<OpeningTimeGroupRequest>({ ...props.openingTimeGroup });

// Configuration options
const openingTimeGroupTypes = ref([
    { label: 'Werkdagen', value: 'daily' },
    { label: 'Wekelijks', value: 'weekly' },
]);

// Day options with localization
const dayOptions = computed(() => [
    { value: 1, label: i18n.global.t('components.calendar.days.monday') },
    { value: 2, label: i18n.global.t('components.calendar.days.tuesday') },
    { value: 3, label: i18n.global.t('components.calendar.days.wednesday') },
    { value: 4, label: i18n.global.t('components.calendar.days.thursday') },
    { value: 5, label: i18n.global.t('components.calendar.days.friday') },
    { value: 6, label: i18n.global.t('components.calendar.days.saturday') },
    { value: 0, label: i18n.global.t('components.calendar.days.sunday') },
]);

// Watch for prop changes
watch(
    () => props.openingTimeGroup,
    (newValue) => {
        localOpeningTimeGroup.value = { ...newValue };
    },
    { deep: true },
);

function addTimeSlot(): void {
    localOpeningTimeGroup.value.timeSlots.push({
        startTime: '09:00',
        endTime: '17:00',
        seatCount: props.defaultSeatCount || 1,
    });
}

function removeTimeSlot(index: number): void {
    localOpeningTimeGroup.value.timeSlots.splice(index, 1);
}

function getTimeSlotStartTime(slot: { startTime: Time; endTime: Time; seatCount: number }): Date {
    return timeToDate(slot.startTime);
}

function setTimeSlotStartTime(
    slot: { startTime: Time; endTime: Time; seatCount: number },
    value: Date,
): void {
    if (value instanceof Date) {
        slot.startTime = dateToTime(value);
    }
}

function getTimeSlotEndTime(slot: { startTime: Time; endTime: Time; seatCount: number }): Date {
    return timeToDate(slot.endTime);
}

function setTimeSlotEndTime(
    slot: { startTime: Time; endTime: Time; seatCount: number },
    value: Date,
): void {
    if (value instanceof Date) {
        slot.endTime = dateToTime(value);
    }
}

function handleApply(): void {
    emit('apply', localOpeningTimeGroup.value);
}

function handleCancel(): void {
    visible.value = false;
}
</script>

<template>
    <Dialog
        v-model:visible="visible"
        header="Openingstijden Groep"
        :style="{ width: '600px' }"
        modal
        :draggable="false"
        :resizable="false">
        <div class="space-y-6">
            <div>
                <label class="mb-2 block text-sm font-medium text-gray-700">Type</label>
                <Dropdown
                    v-model="localOpeningTimeGroup.type"
                    :options="openingTimeGroupTypes"
                    option-label="label"
                    option-value="value"
                    class="w-full" />
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="mb-2 block text-sm font-medium text-gray-700">Start Datum</label>
                    <Calendar v-model="localOpeningTimeGroup.startDate" class="w-full" />
                </div>
                <div>
                    <label class="mb-2 block text-sm font-medium text-gray-700">Eind Datum</label>
                    <Calendar v-model="localOpeningTimeGroup.endDate" class="w-full" />
                </div>
            </div>

            <div v-if="localOpeningTimeGroup.type === 'weekly'">
                <label class="mb-2 block text-sm font-medium text-gray-700">Dagen</label>
                <div class="flex flex-wrap gap-2">
                    <div v-for="day in dayOptions" :key="day.value" class="flex items-center gap-2">
                        <Checkbox v-model="localOpeningTimeGroup.selectedDays" :value="day.value" />
                        <label class="text-sm">{{ day.label }}</label>
                    </div>
                </div>
            </div>

            <div>
                <div class="mb-2 flex items-center justify-between">
                    <label class="text-sm font-medium text-gray-700">Tijdsloten</label>
                    <Button size="small" outlined @click="addTimeSlot">
                        <FontAwesomeIcon :icon="faPlus" class="mr-1" />
                        Tijdslot
                    </Button>
                </div>

                <div class="space-y-3">
                    <div
                        v-for="(slot, index) in localOpeningTimeGroup.timeSlots"
                        :key="index"
                        class="flex items-center gap-3">
                        <div class="flex-1">
                            <label class="mb-1 block text-xs text-gray-500">Start</label>
                            <Calendar
                                :model-value="getTimeSlotStartTime(slot)"
                                show-time
                                time-only
                                hour-format="24"
                                class="w-full"
                                @update:model-value="
                                    (value: Date) => setTimeSlotStartTime(slot, value)
                                " />
                        </div>
                        <div class="flex-1">
                            <label class="mb-1 block text-xs text-gray-500">Eind</label>
                            <Calendar
                                :model-value="getTimeSlotEndTime(slot)"
                                show-time
                                time-only
                                hour-format="24"
                                class="w-full"
                                @update:model-value="
                                    (value: Date) => setTimeSlotEndTime(slot, value)
                                " />
                        </div>
                        <div class="flex-1">
                            <label class="mb-1 block text-xs text-gray-500">Stoelen</label>
                            <InputNumber v-model="slot.seatCount" :min="1" class="w-full" />
                        </div>
                        <Button
                            v-if="localOpeningTimeGroup.timeSlots.length > 1"
                            size="small"
                            severity="danger"
                            outlined
                            @click="removeTimeSlot(index)">
                            <FontAwesomeIcon :icon="faTrash" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>

        <template #footer>
            <div class="flex justify-end gap-3">
                <Button severity="secondary" outlined size="small" @click="handleCancel">
                    Annuleren
                </Button>
                <Button size="small" @click="handleApply">
                    <FontAwesomeIcon :icon="faCalendarPlus" class="mr-2" />
                    Toepassen
                </Button>
            </div>
        </template>
    </Dialog>
</template>
