<script setup lang="ts">
import Button from 'primevue/button';
import {
    faCalendarDays,
    faChevronDown,
    faChevronLeft,
    faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { addToDate, endOfWeek, startOfWeek } from '@/utils/date';
import DateInput from '../form/DateInput.vue';

defineProps<{
    minDate?: Date;
    maxDate?: Date;
}>();

const date = defineModel<Date>('date', {
    default: new Date(),
    required: true,
});

const { locale } = useI18n();

const showDatePicker = ref(false);

const weekStart = computed(() => startOfWeek(date.value));
const weekEnd = computed(() => endOfWeek(date.value));

const weekRangeText = computed(() => {
    const start = weekStart.value;
    const end = weekEnd.value;

    const startStr = start.toLocaleDateString(locale.value, {
        day: 'numeric',
        month: 'short',
    });

    const endStr = end.toLocaleDateString(locale.value, {
        day: 'numeric',
        month: 'short',
    });

    return `${startStr} - ${endStr}`;
});

function onToggleClick(): void {
    showDatePicker.value = !showDatePicker.value;
}

function goToPreviousWeek(): void {
    date.value = addToDate(weekStart.value, -1, 'week');
}

function goToNextWeek(): void {
    date.value = addToDate(weekStart.value, 1, 'week');
}
</script>

<template>
    <!-- Week navigation controls -->
    <div class="flex items-center justify-between">
        <!-- Previous week button -->
        <Button
            severity="secondary"
            outlined
            size="small"
            aria-label="Vorige week"
            @click="goToPreviousWeek"
            rounded
            text>
            <template #icon>
                <FontAwesomeIcon :icon="faChevronLeft" />
            </template>
        </Button>

        <!-- Center controls group -->
        <DateInput
            v-model:date="date"
            v-model:is-visible="showDatePicker"
            :min-date="minDate"
            :max-date="maxDate">
            <template #toggle>
                <!-- Custom toggle button with week range -->
                <button :class="['toggle', { active: showDatePicker }]" @click.stop="onToggleClick">
                    <FontAwesomeIcon :icon="faCalendarDays" class="text-xs text-gray-500" />
                    <span>{{ weekRangeText }}</span>
                    <FontAwesomeIcon
                        :icon="faChevronDown"
                        class="text-xs text-gray-400 transition-all duration-200"
                        :class="{ 'rotate-180': showDatePicker }">
                    </FontAwesomeIcon>
                </button>
            </template>
        </DateInput>

        <!-- Next week button -->
        <Button
            severity="secondary"
            outlined
            rounded
            size="small"
            aria-label="Volgende week"
            @click="goToNextWeek"
            text>
            <template #icon>
                <FontAwesomeIcon :icon="faChevronRight" />
            </template>
        </Button>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.toggle {
    @apply flex items-center gap-2 px-4 py-2;
    @apply rounded-lg text-sm font-medium text-gray-700;
    @apply transition-all duration-200;
    @apply hover:bg-gray-100;

    &.active {
        @apply bg-gray-100;
    }
}
</style>
