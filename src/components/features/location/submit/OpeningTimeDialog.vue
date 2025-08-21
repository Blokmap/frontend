<script setup lang="ts">
import type { CreateOpeningTimeRequest } from '@/types/schema/Location';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Button from 'primevue/button';
import Calendar from 'primevue/calendar';
import Dialog from 'primevue/dialog';
import InputNumber from 'primevue/inputnumber';
import { computed, ref, watch } from 'vue';

const props = defineProps<{
    openingTime: CreateOpeningTimeRequest;
    editingIndex: number | null;
    minDate?: Date;
    maxDate?: Date;
}>();

const visible = defineModel<boolean>('visible', {
    default: false,
});

const emit = defineEmits<{
    save: [openingTime: CreateOpeningTimeRequest];
    delete: [];
}>();

const localOpeningTime = ref<CreateOpeningTimeRequest>({ ...props.openingTime });

// Computed properties for time-only inputs that preserve the date part
const startTimeForInput = computed({
    get: () => {
        // Create a time-only date for the input
        const date = new Date('2000-01-01');
        const original = localOpeningTime.value.startTime;

        // Ensure original is a Date object
        const originalDate = original instanceof Date ? original : new Date(original);
        date.setHours(originalDate.getHours(), originalDate.getMinutes(), 0, 0);
        return date;
    },
    set: (timeOnlyDate: Date) => {
        // Create a new time with the base date but updated time
        const newDateTime = new Date('2000-01-01');
        newDateTime.setHours(timeOnlyDate.getHours(), timeOnlyDate.getMinutes(), 0, 0);
        localOpeningTime.value.startTime = newDateTime;
    },
});

const endTimeForInput = computed({
    get: () => {
        // Create a time-only date for the input
        const date = new Date('2000-01-01');
        const original = localOpeningTime.value.endTime;

        // Ensure original is a Date object
        const originalDate = original instanceof Date ? original : new Date(original);
        date.setHours(originalDate.getHours(), originalDate.getMinutes(), 0, 0);
        return date;
    },
    set: (timeOnlyDate: Date) => {
        // Create a new time with the base date but updated time
        const newDateTime = new Date('2000-01-01');
        newDateTime.setHours(timeOnlyDate.getHours(), timeOnlyDate.getMinutes(), 0, 0);
        localOpeningTime.value.endTime = newDateTime;
    },
});

// Computed property for the date input that updates the day field
const dateForInput = computed({
    get: () => {
        const day = localOpeningTime.value.day;
        return day instanceof Date ? new Date(day) : new Date(day);
    },
    set: (newDate: Date) => {
        localOpeningTime.value.day = new Date(newDate);
    },
});

const dialogTitle = computed(() =>
    props.editingIndex !== null ? 'Openingstijd Bewerken' : 'Openingstijd Toevoegen',
);

const buttonText = computed(() => (props.editingIndex !== null ? 'Bijwerken' : 'Toevoegen'));

watch(
    () => props.openingTime,
    (newValue) => {
        localOpeningTime.value = { ...newValue };
    },
    { deep: true },
);

function handleSave(): void {
    emit('save', localOpeningTime.value);
}

function handleDelete(): void {
    emit('delete');
}
</script>

<template>
    <Dialog
        v-model:visible="visible"
        :header="dialogTitle"
        :style="{ width: '500px' }"
        :draggable="false"
        :resizable="false"
        modal>
        <div class="space-y-4">
            <div>
                <label class="mb-2 block text-sm font-medium text-gray-700">Datum</label>
                <Calendar
                    v-model="dateForInput"
                    :min-date="minDate"
                    :max-date="maxDate"
                    date-format="dd/mm/yy"
                    class="w-full">
                </Calendar>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="mb-2 block text-sm font-medium text-gray-700">Start Tijd</label>
                    <Calendar
                        v-model="startTimeForInput"
                        show-time
                        time-only
                        hour-format="24"
                        class="w-full">
                    </Calendar>
                </div>

                <div>
                    <label class="mb-2 block text-sm font-medium text-gray-700">Eind Tijd</label>
                    <Calendar
                        v-model="endTimeForInput"
                        show-time
                        time-only
                        hour-format="24"
                        class="w-full">
                    </Calendar>
                </div>
            </div>

            <div>
                <label class="mb-2 block text-sm font-medium text-gray-700">Aantal Stoelen</label>
                <InputNumber v-model="localOpeningTime.seatCount" :min="1" class="w-full" />
            </div>
        </div>

        <template #footer>
            <div class="flex w-full justify-between">
                <div>
                    <Button
                        v-if="editingIndex !== null"
                        @click="handleDelete"
                        severity="danger"
                        outlined
                        size="small">
                        <FontAwesomeIcon :icon="faTrash" class="mr-2" />
                        Verwijderen
                    </Button>
                </div>
                <div class="flex gap-3">
                    <Button @click="handleSave" size="small">
                        <FontAwesomeIcon :icon="faPlus" class="mr-2" />
                        {{ buttonText }}
                    </Button>
                </div>
            </div>
        </template>
    </Dialog>
</template>
