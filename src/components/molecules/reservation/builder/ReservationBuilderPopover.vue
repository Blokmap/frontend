<script setup lang="ts">
import Button from 'primevue/button';
import FloatingPopover from '@/components/atoms/FloatingPopover.vue';
import TimeInput from '@/components/atoms/form/TimeInput.vue';
import type { TimeSlot } from '@/domain/calendar';
import type { OpeningTime } from '@/domain/openings';
import type { ReservationRequest } from '@/domain/reservation';

defineProps<{
    targetRef: HTMLElement | null;
    request: ReservationRequest | null;
    openingTimeSlot: TimeSlot<OpeningTime> | null;
}>();

const visible = defineModel<boolean>('visible', {
    required: true,
});

const emit = defineEmits<{
    create: [];
    cancel: [];
}>();

const onCancel = () => {
    visible.value = false;
    emit('cancel');
};
</script>

<template>
    <FloatingPopover :target-ref="targetRef" v-model:visible="visible">
        <div class="reservation-popover">
            <h3 class="text-base font-semibold text-gray-900">Nieuwe reservatie</h3>

            <div class="space-y-3">
                <div>
                    <label class="mb-1 block text-sm font-medium text-gray-700"> Starttijd </label>
                    <TimeInput
                        v-if="request && openingTimeSlot"
                        v-model="request.startTime"
                        :min-time="openingTimeSlot.startTime"
                        :max-time="openingTimeSlot.endTime">
                    </TimeInput>
                </div>

                <div>
                    <label class="mb-1 block text-sm font-medium text-gray-700">Eindtijd</label>
                    <TimeInput
                        v-if="request && openingTimeSlot"
                        v-model="request.endTime"
                        :min-time="openingTimeSlot.startTime"
                        :max-time="openingTimeSlot.endTime">
                    </TimeInput>
                </div>
            </div>

            <div class="flex justify-end gap-2">
                <Button severity="contrast" text size="small" @click="onCancel"> Annuleren </Button>
                <Button size="small" @click="emit('create')">Toevoegen</Button>
            </div>
        </div>
    </FloatingPopover>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.reservation-popover {
    @apply w-full space-y-4 rounded-lg bg-white p-4;
}
</style>
