<script lang="ts" setup>
import Calendar from '@/components/shared/Calendar.vue';
import { useAuthProfile } from '@/composables/data/useAuth';
import { useProfileReservations } from '@/composables/data/useReservations';
import { endOfWeek, formatDateRange, startOfWeek } from '@/utils/date';
import { reservationsToTimeSlots } from '@/utils/reservation';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

const { locale } = useI18n();
const route = useRoute();
const profile = useAuthProfile();
const reservations = useProfileReservations(profile.profileId);

const dateInWeek = computed(() => {
    const dateParam = route.params.dateInWeek?.toString();
    const date = new Date(dateParam);
    return isNaN(date.getTime()) ? new Date() : date;
});

const weekStart = computed(() => startOfWeek(dateInWeek.value));
const weekEnd = computed(() => endOfWeek(dateInWeek.value));

// Convert reservations to time slots for the current week
const reservationTimeSlots = computed(() =>
    reservationsToTimeSlots(reservations.data.value, weekStart.value, weekEnd.value),
);

const weekRangeText = computed(() => formatDateRange(weekStart.value, weekEnd.value, locale.value));
</script>

<template>
    <div class="mt-2 mb-8 space-y-2 text-center">
        <h1 class="text-3xl font-bold text-gray-900">Mijn reservaties</h1>
        <p class="text-lg text-gray-600">Week van {{ weekRangeText }}</p>
    </div>
    <Calendar :current-week="dateInWeek" :time-slots="reservationTimeSlots">
        <template #timeSlot="{ slot }"> {{ slot.startTime }} - {{ slot.endTime }} </template>
    </Calendar>

    <div v-if="reservationTimeSlots.length === 0" class="flex items-center justify-center py-16">
        <div class="max-w-md space-y-4 text-center">
            <div class="text-6xl">📅</div>
            <h3 class="text-xl font-semibold text-gray-900">Geen reservaties deze week</h3>
            <p class="text-gray-600">Je hebt geen reservaties voor de geselecteerde week.</p>
        </div>
    </div>
</template>

<style scoped></style>
