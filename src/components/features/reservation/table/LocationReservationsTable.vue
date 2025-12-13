<script lang="ts" setup>
import ReservationStateBadge from '@/components/features/reservation/state/ReservationStateBadge.vue';
import EntityAvatar from '@/components/shared/molecules/avatar/EntityAvatar.vue';
import Table from '@/components/shared/molecules/table/Table.vue';
import TableCell from '@/components/shared/molecules/table/TableCell.vue';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { ReservationState, type Reservation, type ReservationGroup } from '@/domain/reservation';
import { timeToString } from '@/utils/time';
import ReservationActionMenu from '../ReservationActionMenu.vue';

const props = defineProps<{
    reservations?: Reservation[];
    loading?: boolean;
    isReservationPending?: (reservationId: string) => boolean;
}>();

const emit = defineEmits<{
    'change:status': [reservationId: string, status: ReservationState];
}>();

function onStatusChange(reservationId: string, state: ReservationState): void {
    emit('change:status', reservationId, state);
}

const { locale } = useI18n();

// Group reservations by profile
const groupedReservations = computed(() => {
    if (!props.reservations?.length) {
        return [];
    }

    const grouped = new Map<string, ReservationGroup>();

    for (const reservation of props.reservations) {
        const profileId = reservation.createdBy?.id;

        if (!reservation.createdBy || !profileId) {
            continue;
        }

        if (!grouped.has(profileId)) {
            grouped.set(profileId, {
                profile: reservation.createdBy,
                reservations: [],
            });
        }

        grouped.get(profileId)!.reservations.push(reservation);
    }

    const result = Array.from(grouped.values()).map((groupData) => ({
        group: groupData,
        items: groupData.reservations,
    }));

    return result;
});
</script>

<template>
    <Table :grouped="groupedReservations" :loading="loading">
        <template #group="{ data, items }">
            <RouterLink
                :to="{
                    name: 'manage',
                    params: { profileId: data.profile.id },
                }"
                class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                    <EntityAvatar class="h-10 w-10 flex-shrink-0" :profile="data.profile" />

                    <div>
                        <div class="text-sm font-medium text-slate-900">
                            {{ data.profile.firstName }} {{ data.profile.lastName }}
                        </div>
                        <div class="text-xs text-slate-500">
                            {{ items.length }} reservatie{{ items.length !== 1 ? 's' : '' }}
                        </div>
                    </div>
                </div>
            </RouterLink>
        </template>

        <template #row="{ data }">
            <TableCell column="Tijd">
                <FontAwesomeIcon :icon="faClock" class="mr-1" />
                {{ timeToString(data.startTime) }} -
                {{ timeToString(data.endTime) }}
            </TableCell>
            <TableCell column="Aanmaakdatum">
                {{
                    data.createdAt.toLocaleDateString(locale, {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    })
                }}
            </TableCell>
            <TableCell column="Status">
                <ReservationStateBadge :state="data.state" />
            </TableCell>
            <TableCell column="Acties">
                <div class="flex justify-center">
                    <ReservationActionMenu
                        :reservation="data"
                        :pending-update="isReservationPending?.(data.id)"
                        @select:state="onStatusChange(data.id, $event)">
                    </ReservationActionMenu>
                </div>
            </TableCell>
        </template>
    </Table>
</template>
