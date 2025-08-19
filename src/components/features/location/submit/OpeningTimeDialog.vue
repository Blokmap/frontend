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
}>();

const visible = defineModel<boolean>('visible', {
    default: false,
});

const emit = defineEmits<{
    save: [openingTime: CreateOpeningTimeRequest];
    delete: [];
}>();

const localOpeningTime = ref<CreateOpeningTimeRequest>({ ...props.openingTime });

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
                <label class="mb-2 block text-sm font-medium text-gray-700">Start Tijd</label>
                <Calendar
                    v-model="localOpeningTime.startTime"
                    show-time
                    time-only
                    hour-format="12"
                    class="w-full">
                </Calendar>
            </div>

            <div>
                <label class="mb-2 block text-sm font-medium text-gray-700">Eind Tijd</label>
                <Calendar
                    v-model="localOpeningTime.endTime"
                    show-time
                    time-only
                    hour-format="12"
                    class="w-full">
                </Calendar>
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
