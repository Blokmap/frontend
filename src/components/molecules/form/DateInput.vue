<script setup lang="ts">
import DatePicker from 'primevue/datepicker';
import InputText from 'primevue/inputtext';
import FloatingPopover from '@/components/atoms/FloatingPopover.vue';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineProps<{
    inputId?: string;
    minDate?: Date;
    maxDate?: Date;
}>();

const isVisible = defineModel<boolean>('is-visible', {
    default: false,
});

const date = defineModel<Date>('date', {
    default: new Date(),
    required: true,
});

const containerRef = ref<HTMLElement | null>(null);

const { locale } = useI18n();

const formattedDate = computed(() => {
    return date.value.toLocaleDateString(locale.value, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
});

function hideOverlay(): void {
    isVisible.value = false;
}

function toggleOverlay(): void {
    isVisible.value = !isVisible.value;
}

function handleDateSelect(newDate: any): void {
    if (newDate && newDate instanceof Date) {
        date.value = newDate;
        hideOverlay();
    }
}
</script>

<template>
    <!-- Trigger -->
    <div ref="containerRef">
        <slot name="toggle" :toggle="toggleOverlay" :isOpen="isVisible">
            <InputText
                class="w-full"
                @click="toggleOverlay"
                :id="inputId"
                :model-value="formattedDate"
                readonly>
            </InputText>
        </slot>
    </div>

    <!-- Overlay -->
    <FloatingPopover :target-ref="containerRef" v-model:visible="isVisible">
        <div @click.stop>
            <DatePicker
                v-model="date"
                :locale="locale"
                :min-date="minDate"
                :max-date="maxDate"
                @update:model-value="handleDateSelect"
                inline>
                <template #footer>
                    <slot name="footer" :close="hideOverlay"></slot>
                </template>
            </DatePicker>
        </div>
    </FloatingPopover>
</template>
