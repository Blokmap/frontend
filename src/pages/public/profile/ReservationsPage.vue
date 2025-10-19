<script setup lang="ts">
import CalendarControls from '@/components/shared/molecules/calendar/CalendarControls.vue';
import { formatDate } from '@vueuse/core';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

const inWeekOf = computed(() => {
    const dateParam = route.params.inWeekOf?.toString();
    const date = new Date(dateParam);
    return isNaN(date.getTime()) ? new Date() : date;
});

function handleDateInWeekUpdate(newDate: Date): void {
    const dateString = formatDate(newDate, 'YYYY-MM-DD');
    router.push({
        name: 'profile.reservations',
        params: {
            inWeekOf: dateString,
        },
    });
}

function handleDateSelect(date: any): void {
    if (date instanceof Date) {
        handleDateInWeekUpdate(date);
    }
}
</script>

<template>
    <div class="space-y-6">
        <div class="flex h-full flex-col space-y-6">
            <CalendarControls :date="inWeekOf" @update:date="handleDateSelect"> </CalendarControls>

            <div class="flex-1 overflow-hidden"></div>
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
