<script setup lang="ts">
import Button from 'primevue/button';
import DatePicker from 'primevue/datepicker';
import {
    faCalendarDays,
    faChevronDown,
    faChevronLeft,
    faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { startOfWeek } from '@/utils/date';

const props = defineProps<{
    currentWeek: Date;
    minDate?: Date;
    maxDate?: Date;
}>();

const emit = defineEmits<{
    'click:previous-week': [];
    'click:next-week': [];
    'click:current-week': [];
    'select:date': [date: Date];
}>();

const { locale } = useI18n();

const showDatePicker = ref(false);

const weekStart = computed(() => startOfWeek(props.currentWeek));

const weekEnd = computed(() => {
    const end = new Date(weekStart.value);
    end.setDate(end.getDate() + 6);
    return end;
});

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

const isSelectedDateOutsideCurrentWeek = computed(() => {
    if (!props.currentWeek) return false;

    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const weekStartTime = weekStart.value.getTime();
    const weekEndTime = weekEnd.value.getTime();

    return todayStart.getTime() < weekStartTime || todayStart.getTime() > weekEndTime;
});

function goToPreviousWeek(): void {
    emit('click:previous-week');
}

function goToNextWeek(): void {
    emit('click:next-week');
}

function handleDateSelect(date: any): void {
    if (date && date instanceof Date) {
        showDatePicker.value = false;
        emit('select:date', date);
    }
}

function toggleDatePicker(): void {
    showDatePicker.value = !showDatePicker.value;
}

function goToToday(): void {
    showDatePicker.value = false;
    emit('click:current-week');
}
</script>

<template>
    <!-- Default navigation implementation -->
    <div class="space-y-4" @click="showDatePicker = false">
        <!-- Week navigation controls -->
        <div class="flex items-center justify-between" @click.stop>
            <!-- Previous week button -->
            <Button
                severity="secondary"
                outlined
                rounded
                size="small"
                aria-label="Vorige week"
                @click="goToPreviousWeek">
                <template #icon>
                    <FontAwesomeIcon :icon="faChevronLeft" />
                </template>
            </Button>

            <!-- Center controls group -->
            <div class="relative flex items-center gap-2">
                <!-- Clickable week label -->
                <button
                    class="date-picker-toggle"
                    :class="{ 'date-picker-toggle--active': showDatePicker }"
                    @click.stop="toggleDatePicker">
                    <FontAwesomeIcon :icon="faCalendarDays" class="text-xs text-gray-500" />

                    <span>{{ weekRangeText }}</span>

                    <FontAwesomeIcon
                        :icon="faChevronDown"
                        class="text-xs text-gray-400 transition-all duration-200"
                        :class="{ 'rotate-180': showDatePicker }">
                    </FontAwesomeIcon>
                </button>

                <!-- Date picker overlay -->
                <Transition name="slide-down">
                    <div v-if="showDatePicker" class="date-picker-overlay" @click.stop>
                        <DatePicker
                            :model-value="props.currentWeek"
                            :locale="locale"
                            :min-date="minDate"
                            :max-date="maxDate"
                            inline
                            @update:model-value="handleDateSelect">
                            <template v-if="isSelectedDateOutsideCurrentWeek" #footer>
                                <div class="flex justify-end border-t-1 border-gray-200 pt-3">
                                    <Button
                                        severity="primary"
                                        size="small"
                                        class="transition-all duration-200"
                                        @click="goToToday">
                                        Vandaag
                                    </Button>
                                </div>
                            </template>
                        </DatePicker>
                    </div>
                </Transition>
            </div>
            <!-- Next week button -->
            <Button
                severity="secondary"
                outlined
                rounded
                size="small"
                aria-label="Volgende week"
                @click="goToNextWeek">
                <template #icon>
                    <FontAwesomeIcon :icon="faChevronRight" />
                </template>
            </Button>
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

/* Date picker toggle button */
.date-picker-toggle {
    @apply flex items-center gap-2;
    @apply px-4 py-2;
    @apply text-sm font-medium text-gray-700;
    @apply rounded-lg;
    @apply transition-all duration-200;
    @apply hover:bg-gray-100;
    @apply focus:ring-secondary-400 focus:ring-2 focus:ring-offset-1 focus:outline-none;
}

.date-picker-toggle--active {
    @apply bg-gray-100;
}

/* Date picker overlay positioning */
.date-picker-overlay {
    @apply absolute top-full left-1/2 z-50 mt-2 -translate-x-1/2 transform;
}

/* Utility transition class */
.transition-all {
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
