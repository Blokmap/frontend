<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { formatDayName, isToday } from '@/utils/date/date';

defineProps<{
    day: Date;
}>();

const emit = defineEmits<{
    'click:day': [day: Date];
}>();

const { locale } = useI18n();

function handleDayClick(day: Date): void {
    emit('click:day', day);
}
</script>

<template>
    <div :class="{ today: isToday(day) }" @click="handleDayClick(day)">
        <div class="text-sm font-medium md:text-xs">
            {{ formatDayName(day, 'short', locale) }}
        </div>
        <div
            class="mt-1 text-lg font-semibold md:text-base"
            :class="{ 'today-indicator': isToday(day) }">
            {{ day.getDate() }}
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.today {
    @apply bg-secondary-50 text-secondary-500;
}

.today-indicator {
    @apply mx-auto flex;
    @apply h-8 w-8;
    @apply items-center justify-center;
    @apply bg-secondary-500 rounded-full text-white;

    @media (max-width: 768px) {
        @apply h-6 w-6;
        @apply text-sm;
    }
}
</style>
