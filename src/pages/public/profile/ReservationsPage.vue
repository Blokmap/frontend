<script setup lang="ts">
import CalendarControls from '@/components/shared/molecules/calendar/CalendarControls.vue';
import { useRouteDate } from '@/composables/useRouteDate';

const inWeekOf = useRouteDate({ paramName: 'inWeekOf', source: 'params', updateMethod: 'push' });

function handleDateSelect(date: Date): void {
    inWeekOf.value = date;
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
