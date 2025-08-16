<script setup lang="ts">
import type { CreateOpeningTimeRequest } from '@/types/schema/Location';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Button from 'primevue/button';
import Calendar from 'primevue/calendar';
import Dialog from 'primevue/dialog';
import InputNumber from 'primevue/inputnumber';
import { computed, ref, watch } from 'vue';

const props = defineProps<{
    visible: boolean;
    openingTime: CreateOpeningTimeRequest;
    editingIndex: number | null;
}>();

const emit = defineEmits<{
    'update:visible': [value: boolean];
    save: [openingTime: CreateOpeningTimeRequest];
    close: [];
}>();

const localOpeningTime = ref<CreateOpeningTimeRequest>({ ...props.openingTime });

const dialogTitle = computed(() =>
    props.editingIndex !== null ? 'Openingstijd Bewerken' : 'Openingstijd Toevoegen',
);

const buttonText = computed(() => (props.editingIndex !== null ? 'Bijwerken' : 'Toevoegen'));

// Watch for prop changes to update local state
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

function handleClose(): void {
    emit('close');
}

function updateVisible(value: boolean): void {
    emit('update:visible', value);
}
</script>

<template>
    <Dialog
        :visible="visible"
        @update:visible="updateVisible"
        :header="dialogTitle"
        :style="{ width: '500px' }"
        modal
        :draggable="false"
        :resizable="false">
        <div class="space-y-4">
            <div>
                <label class="mb-2 block text-sm font-medium text-gray-700">Start Tijd</label>
                <Calendar
                    v-model="localOpeningTime.startTime"
                    show-time
                    hour-format="24"
                    class="w-full" />
            </div>

            <div>
                <label class="mb-2 block text-sm font-medium text-gray-700">Eind Tijd</label>
                <Calendar
                    v-model="localOpeningTime.endTime"
                    show-time
                    hour-format="24"
                    class="w-full" />
            </div>

            <div>
                <label class="mb-2 block text-sm font-medium text-gray-700">Aantal Stoelen</label>
                <InputNumber v-model="localOpeningTime.seatCount" :min="1" class="w-full" />
            </div>
        </div>

        <template #footer>
            <div class="flex justify-end gap-3">
                <Button @click="handleClose" severity="secondary" outlined size="small">
                    Annuleren
                </Button>
                <Button @click="handleSave" size="small">
                    <FontAwesomeIcon :icon="faPlus" class="mr-2" />
                    {{ buttonText }}
                </Button>
            </div>
        </template>
    </Dialog>
</template>
