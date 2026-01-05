<script setup lang="ts">
import DatePicker from 'primevue/datepicker';
import InputText from 'primevue/inputtext';
import FloatingPopover from '@/components/atoms/FloatingPopover.vue';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineProps<{
    inputId?: string;
    minDate?: Date;
    maxDate?: Date;
    placeholder?: string;
    showClear?: boolean;
}>();

const isVisible = defineModel<boolean>('is-visible', {
    default: false,
});

const date = defineModel<Date | null>('date', {
    default: null,
});

const containerRef = ref<HTMLElement | null>(null);

const { locale } = useI18n();

const formattedDate = computed(() => {
    if (!date.value) return '';
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
    <div ref="containerRef" class="date-input">
        <slot name="toggle" :toggle="toggleOverlay" :isOpen="isVisible">
            <InputText
                class="w-full"
                @click="toggleOverlay"
                :id="inputId"
                :model-value="formattedDate"
                :placeholder="placeholder"
                readonly>
            </InputText>
            <button
                v-if="date && showClear"
                @click.stop="date = null"
                type="button"
                class="date-input__clear">
                <FontAwesomeIcon :icon="faX" />
            </button>
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

<style scoped>
@reference '@/assets/styles/main.css';

.date-input {
    @apply relative;

    .date-input__clear {
        @apply absolute top-1/2 right-2 -translate-y-1/2;
        @apply text-slate-400 hover:text-slate-600;
        @apply text-xs leading-none;
    }
}
</style>
