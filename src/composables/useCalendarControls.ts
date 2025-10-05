import { isRef, ref, type MaybeRef } from 'vue';
import { addToDate } from '@/utils/date';

export function useCalendarControls(week: MaybeRef<Date> = new Date()) {
    const currentWeek = isRef(week) ? week : ref<Date>(week);

    function goToPreviousWeek(): void {
        currentWeek.value = addToDate(currentWeek.value, -1, 'week');
    }

    function goToNextWeek(): void {
        currentWeek.value = addToDate(currentWeek.value, 1, 'week');
    }

    function goToCurrentWeek(): void {
        currentWeek.value = new Date();
    }

    function goToWeek(date: Date): void {
        currentWeek.value = date;
    }

    return {
        currentWeek,
        goToPreviousWeek,
        goToNextWeek,
        goToCurrentWeek,
        goToWeek,
    };
}
