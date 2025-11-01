<script lang="ts" setup>
import Paginator from 'primevue/paginator';
import Select, { type SelectChangeEvent } from 'primevue/select';
import ProfileAvatar from '@/components/features/profile/avatar/ProfileAvatar.vue';
import ReservationStateBadge from '@/components/features/reservation/state/ReservationStateBadge.vue';
import ActionMenu from '@/components/shared/atoms/ActionMenu.vue';
import Table from '@/components/shared/molecules/table/Table.vue';
import TableCell from '@/components/shared/molecules/table/TableCell.vue';
import {
    faCheckCircle,
    faClock,
    faHourglassHalf,
    faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { ReservationState, type Reservation, type ReservationGroup } from '@/domain/reservation';
import { timeToString } from '@/utils/time';

const props = defineProps<{
    reservations?: Reservation[];
    loading?: boolean;
    isReservationPending?: (reservationId: string) => boolean;
}>();

const emit = defineEmits<{
    'change:status': [reservationId: string, status: ReservationState];
}>();

const { locale } = useI18n();

// Pagination state
const currentPage = ref(0); // PrimeVue uses 0-based index for first
const rowsPerPage = ref(100);

// Options for reservation status select
const statusOptions = computed(() => {
    return [
        { label: 'Aangemaakt', value: ReservationState.Created, icon: faHourglassHalf },
        { label: 'Aanwezig', value: ReservationState.Present, icon: faCheckCircle },
        { label: 'Afwezig', value: ReservationState.Absent, icon: faTimesCircle },
    ];
});

// Group reservations by profile
const groupedReservations = computed(() => {
    if (!props.reservations?.length) return [];

    const grouped = new Map<string, ReservationGroup>();

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

    const result = Array.from(grouped.values()).map((groupData) => ({
        group: groupData,
        items: groupData.reservations,
    }));

    return result;
});

// Pre-format dates for all reservations to avoid expensive toLocaleDateString calls in template
const formattedDates = computed(() => {
    const dateMap = new Map<string, string>();
    if (!props.reservations?.length) return dateMap;

    const formatter = new Intl.DateTimeFormat(locale.value, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    for (const reservation of props.reservations) {
        dateMap.set(reservation.id, formatter.format(reservation.createdAt));
    }

    return dateMap;
});

// Pre-compute status icons to avoid function calls in template
const statusIcons = computed(() => {
    const iconMap = new Map<string, any>();
    if (!props.reservations?.length) return iconMap;

    for (const reservation of props.reservations) {
        const option = statusOptions.value.find((opt) => opt.value === reservation.state);
        if (option) {
            iconMap.set(reservation.id, option.icon);
        }
    }

    return iconMap;
});

// Paginated grouped reservations
const paginatedGroupedReservations = computed(() => {
    const start = currentPage.value * rowsPerPage.value;
    const end = start + rowsPerPage.value;
    return groupedReservations.value.slice(start, end);
});

// Total number of groups for pagination
const totalGroups = computed(() => groupedReservations.value.length);

/**
 * Handle page change from the paginator.
 *
 * @param event The page event from PrimeVue Paginator.
 */
function onPageChange(event: { first: number; rows: number; page: number }) {
    currentPage.value = event.page;
    rowsPerPage.value = event.rows;
}

/**
 * Handle status change for a reservation.
 *
 * @param reservationId The ID of the reservation.
 * @param event The select change event.
 * @param hideMenu Function to hide the action menu.
 */
function onStatusChange(
    reservationId: string,
    event: SelectChangeEvent,
    hideMenu: () => void,
): void {
    const state = event.value as ReservationState;

    if (state) {
        hideMenu();
        emit('change:status', reservationId, state);
    }
}

/**
 * Get the selected status option for a reservation.
 *
 * @param reservation The reservation to get the status for.
 * @returns The selected status option or null.
 */
function getSelectedStatusOption(reservation: Reservation) {
    return statusOptions.value.find((opt) => opt.value === reservation.state) || null;
}
</script>

<template>
    <div>
        <Table
            :grouped="paginatedGroupedReservations"
            :loading="loading"
            empty-message="Geen reservaties gevonden voor deze datum.">
            <template #group="{ data, items }">
                <RouterLink
                    :to="{
                        name: 'dashboard.profiles.detail.overview',
                        params: { profileId: data.profile.id },
                    }"
                    class="flex items-center justify-between">
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
                </RouterLink>
            </template>

            <template #row="{ data }">
                <TableCell column="Tijd">
                    <FontAwesomeIcon :icon="faClock" class="mr-1" />
                    {{ timeToString(data.startTime) }} -
                    {{ timeToString(data.endTime) }}
                </TableCell>
                <TableCell column="Aanmaakdatum">
                    {{ formattedDates.get(data.id) }}
                </TableCell>
                <TableCell column="Status">
                    <ReservationStateBadge :state="data.state" />
                </TableCell>
                <TableCell column="Acties">
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
                                        @change="
                                            (event) => onStatusChange(data.id, event, hideMenu)
                                        ">
                                        <template #option="{ option }">
                                            <div class="flex items-center gap-2 text-sm">
                                                <FontAwesomeIcon :icon="option.icon" />
                                                <span>{{ option.label }}</span>
                                            </div>
                                        </template>
                                        <template #value="{ value }">
                                            <div
                                                v-if="value && statusIcons.get(data.id)"
                                                class="flex items-center gap-2 text-sm">
                                                <FontAwesomeIcon :icon="statusIcons.get(data.id)" />
                                                <span>{{
                                                    getSelectedStatusOption(data)!.label
                                                }}</span>
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

        <Paginator
            v-if="totalGroups > 0"
            :first="currentPage * rowsPerPage"
            :rows="rowsPerPage"
            :total-records="totalGroups"
            @page="onPageChange">
        </Paginator>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
