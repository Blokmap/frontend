<script lang="ts" setup>
import Select, { type SelectChangeEvent } from 'primevue/select';
import ProfileAvatar from '@/components/features/profile/avatar/ProfileAvatar.vue';
import ReservationStateBadge from '@/components/features/reservation/state/ReservationStateBadge.vue';
import ActionMenu from '@/components/shared/atoms/ActionMenu.vue';
import Table from '@/components/shared/molecules/table/Table.vue';
import TableCell from '@/components/shared/molecules/table/TableCell.vue';
import TableHead from '@/components/shared/molecules/table/TableHead.vue';
import {
    faCheckCircle,
    faClock,
    faHourglassHalf,
    faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { ReservationState, type Reservation, type ReservationGroup } from '@/domain/reservation';
import { timeToString } from '@/utils/time';

const props = defineProps<{
    reservations?: Reservation[];
    loading?: boolean;
    isReservationPending?: (reservationId: number) => boolean;
}>();

const emit = defineEmits<{
    'change:status': [reservationId: number, status: ReservationState];
}>();

const { locale } = useI18n();

const statusOptions = computed(() => {
    return [
        { label: 'Aangemaakt', value: ReservationState.Created, icon: faHourglassHalf },
        { label: 'Aanwezig', value: ReservationState.Present, icon: faCheckCircle },
        { label: 'Afwezig', value: ReservationState.Absent, icon: faTimesCircle },
    ];
});

// Group reservations by profile
const groupedReservations = computed(() => {
    if (!props.reservations) return [];

    const grouped = new Map<number, ReservationGroup>();

    for (const reservation of props.reservations) {
        const profileId = reservation.createdBy?.id;

        if (!profileId || !reservation.createdBy) {
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

    return Array.from(grouped.values()).map((groupData) => ({
        group: groupData,
        items: groupData.reservations,
    }));
});

const onStatusChange = (
    reservationId: number,
    event: SelectChangeEvent,
    hideMenu: () => void,
): void => {
    const state = event.value as ReservationState;

    if (state) {
        hideMenu();
        emit('change:status', reservationId, state);
    }
};

const getSelectedStatusOption = (reservation: Reservation) => {
    return statusOptions.value.find((opt) => opt.value === reservation.state) || null;
};
</script>

<template>
    <div
        v-if="!groupedReservations.length"
        class="rounded-lg border border-slate-200 bg-white px-6 py-12 text-center">
        <p class="text-sm text-slate-500">Geen reservaties gevonden voor deze datum.</p>
    </div>

    <Table v-else :grouped="groupedReservations">
        <template #header>
            <tr>
                <TableHead>Tijd</TableHead>
                <TableHead>Aanmaakdatum</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Acties</TableHead>
            </tr>
        </template>

        <template #group="{ data, items }">
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                    <div class="h-10 w-10 flex-shrink-0">
                        <ProfileAvatar :profile="data.profile" />
                    </div>
                    <div>
                        <div class="text-sm font-medium text-slate-900">
                            {{ data.profile.firstName }} {{ data.profile.lastName }}
                        </div>
                        <div class="text-xs text-slate-500">
                            {{ items.length }} reservatie{{ items.length !== 1 ? 's' : '' }}
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <template #row="{ data }">
            <TableCell>
                <FontAwesomeIcon :icon="faClock" class="mr-1" />
                {{ timeToString(data.startTime) }} -
                {{ timeToString(data.endTime) }}
            </TableCell>
            <TableCell>
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
            <TableCell>
                <ReservationStateBadge :state="data.state" />
            </TableCell>
            <TableCell>
                <div class="flex justify-center">
                    <ActionMenu :is-pending="isReservationPending?.(data.id)">
                        <template #content="{ hideMenu }">
                            <div>
                                <label class="mb-1 block text-sm font-medium text-gray-700">
                                    Status wijzigen
                                </label>
                                <Select
                                    :model-value="data.state"
                                    :options="statusOptions"
                                    :loading="isReservationPending?.(data.id)"
                                    option-label="label"
                                    option-value="value"
                                    placeholder="Selecteer nieuwe status"
                                    class="w-full min-w-[200px]"
                                    @change="(event) => onStatusChange(data.id, event, hideMenu)">
                                    <template #option="{ option }">
                                        <div class="flex items-center gap-2 text-sm">
                                            <FontAwesomeIcon :icon="option.icon" />
                                            <span>{{ option.label }}</span>
                                        </div>
                                    </template>
                                    <template #value="{ value }">
                                        <div
                                            v-if="value && getSelectedStatusOption(data)"
                                            class="flex items-center gap-2 text-sm">
                                            <FontAwesomeIcon
                                                :icon="getSelectedStatusOption(data)!.icon" />
                                            <span>{{ getSelectedStatusOption(data)!.label }}</span>
                                        </div>
                                    </template>
                                </Select>
                            </div>
                        </template>
                    </ActionMenu>
                </div>
            </TableCell>
        </template>
    </Table>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
