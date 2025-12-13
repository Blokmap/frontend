<script lang="ts" setup>
import ReservationStateBadge from '@/components/features/reservation/state/ReservationStateBadge.vue';
import Table from '@/components/shared/molecules/table/Table.vue';
import TableCell from '@/components/shared/molecules/table/TableCell.vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterLink } from 'vue-router';
import { timeToString } from '@/utils/time';
import ReservationActionMenu from '../ReservationActionMenu.vue';
import type { DayGroup } from '.';
import type { Reservation } from '@/domain/reservation';

const props = withDefaults(
    defineProps<{
        reservations?: Reservation[];
        loading?: boolean;
        showActions?: boolean;
    }>(),
    {
        showActions: true,
    },
);
const i18n = useI18n();

// Group reservations by day of the week
const groupedReservations = computed(() => {
    if (!props.reservations) return [];

    // Group reservations per day of the week
    const grouped = new Map<string, DayGroup>();
    const locale = i18n.locale.value;

    for (const reservation of props.reservations) {
        const reservationDate = new Date(reservation.day);
        const dateKey = reservationDate.toDateString();

        if (!grouped.has(dateKey)) {
            const dayName = reservationDate.toLocaleDateString(locale, {
                weekday: 'short',
            });

            const fullDate = reservationDate.toLocaleDateString(locale, {
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

        const group = grouped.get(dateKey)!;
        group.reservations.push(reservation);
    }

    // Sort by date and convert to array format expected by Table component
    const sorted = [...grouped.values()].sort((a, b) => a.date.getTime() - b.date.getTime());

    // Return in the format expected by Table component
    const data = sorted.map((group) => ({
        group,
        items: group.reservations,
    }));

    return data;
});
</script>

<template>
    <Table
        :grouped="groupedReservations"
        :loading="loading"
        empty-message="Geen reservaties deze week.">
        <template #group="{ data, items }">
            <div class="flex items-center gap-2">
                <span class="text-lg font-bold text-slate-900 uppercase">
                    {{ data.dayName }}
                </span>
                <span class="text-sm text-slate-600">{{ data.fullDate }}</span>
            </div>
        </template>

        <template #row="{ data }">
            <TableCell column="Locatie">
                <RouterLink
                    v-if="data.location"
                    :to="{ name: 'locations.detail', params: { locationId: data.location.id } }"
                    class="underline">
                    {{ data.location.name }}
                </RouterLink>
                <span v-else class="font-medium text-slate-900">Onbekende Locatie</span>
            </TableCell>
            <TableCell column="Aanmaakdatum">
                {{
                    data.createdAt.toLocaleDateString(i18n.locale.value, {
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
            <TableCell column="Acties" v-if="showActions">
                <slot name="actions">
                    <ReservationActionMenu :reservation="data" :show-state-select="false" />
                </slot>
            </TableCell>
        </template>
    </Table>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
