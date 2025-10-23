<script lang="ts" setup>
import ReservationStateBadge from '@/components/features/reservation/state/ReservationStateBadge.vue';
import Table from '@/components/shared/molecules/table/Table.vue';
import TableCell from '@/components/shared/molecules/table/TableCell.vue';
import { faCalendarDay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterLink } from 'vue-router';

import { startOfDay, startOfWeek, endOfWeek } from '@/utils/date';
import { timeToString, getTimeDuration, minutesToTime } from '@/utils/time';
import type { Reservation } from '@/domain/reservation';

const props = defineProps<{
    reservations?: Reservation[];
    loading?: boolean;
}>();

const { locale } = useI18n();

type DayGroup = {
    date: Date;
    dayName: string;
    fullDate: string;
    reservations: Reservation[];
};

// Group reservations by day of the week
const groupedReservations = computed(() => {
    if (!props.reservations) return [];

    const now = new Date();
    const monday = startOfDay(startOfWeek(now));
    const sunday = endOfWeek(now);
    sunday.setHours(23, 59, 59, 999);

    const grouped = new Map<string, DayGroup>();

    // Filter reservations for current week
    const weekReservations = props.reservations.filter((reservation) => {
        const reservationDate = new Date(reservation.day);
        return reservationDate >= monday && reservationDate <= sunday;
    });

    // Group by day
    for (const reservation of weekReservations) {
        const reservationDate = new Date(reservation.day);
        const dateKey = reservationDate.toDateString();

        if (!grouped.has(dateKey)) {
            const dayName = reservationDate.toLocaleDateString(locale.value, {
                weekday: 'short',
            });
            const fullDate = reservationDate.toLocaleDateString(locale.value, {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            });

            grouped.set(dateKey, {
                date: reservationDate,
                dayName,
                fullDate,
                reservations: [],
            });
        }

        grouped.get(dateKey)!.reservations.push(reservation);
    }

    // Sort by date and convert to array format expected by Table component
    return Array.from(grouped.values())
        .sort((a, b) => a.date.getTime() - b.date.getTime())
        .map((groupData) => ({
            group: groupData,
            items: groupData.reservations,
        }));
});

const getTotalDuration = (reservations: Reservation[]) => {
    let totalMinutes = 0;
    for (const reservation of reservations) {
        totalMinutes += getTimeDuration(reservation.startTime, reservation.endTime);
    }
    const time = minutesToTime(totalMinutes);
    return time.minutes > 0 ? `${time.hours}u ${time.minutes}m` : `${time.hours}u`;
};
</script>

<template>
    <Table
        :grouped="groupedReservations"
        :is-loading="loading"
        empty-message="Geen reservaties deze week.">
        <template #group="{ data, items }">
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                    <div
                        class="bg-primary-100 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg">
                        <FontAwesomeIcon :icon="faCalendarDay" class="text-primary-600 text-lg" />
                    </div>
                    <div>
                        <div class="flex items-center gap-2">
                            <span class="text-lg font-bold text-slate-900 uppercase">
                                {{ data.dayName }}
                            </span>
                            <span class="text-sm text-slate-600">{{ data.fullDate }}</span>
                        </div>
                        <div class="text-xs text-slate-500">
                            {{ items.length }} reservatie{{ items.length !== 1 ? 's' : '' }} •
                            {{ getTotalDuration(items) }}
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <template #row="{ data }">
            <TableCell column="Locatie">
                <RouterLink
                    v-if="data.location"
                    :to="{ name: 'locations.detail', params: { locationId: data.location.id } }"
                    class="text-secondary font-medium hover:underline">
                    {{ data.location.name }}
                </RouterLink>
                <span v-else class="font-medium text-slate-900">Onbekende Locatie</span>
            </TableCell>
            <TableCell column="Aanmaakdatum">
                {{
                    data.createdAt.toLocaleDateString(locale, {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    })
                }}
            </TableCell>
            <TableCell column="Reservatietijd">
                {{ timeToString(data.startTime) }} - {{ timeToString(data.endTime) }}
            </TableCell>
            <TableCell column="Status">
                <ReservationStateBadge :state="data.state" />
            </TableCell>
        </template>
    </Table>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
