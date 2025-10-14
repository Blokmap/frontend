<script lang="ts" setup>
import Button from 'primevue/button';
import ProfileAvatar from '@/components/features/profile/avatar/ProfileAvatar.vue';
import ActionMenu from '@/components/shared/atoms/ActionMenu.vue';
import Table from '@/components/shared/molecules/table/Table.vue';
import TableCell from '@/components/shared/molecules/table/TableCell.vue';
import TableHead from '@/components/shared/molecules/table/TableHead.vue';
import { faCheck, faCheckDouble } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';
import { timeToString } from '@/utils/time';
import type { Profile } from '@/domain/profile';
import type { Reservation } from '@/domain/reservation';

const props = defineProps<{
    reservations?: Reservation[];
    loading?: boolean;
    isReservationPending?: (reservationId: number) => boolean;
}>();

const emit = defineEmits<{
    'confirm:reservation': [reservationId: number];
    'confirm:profile': [profileId: number];
}>();

interface ReservationGroup {
    profile: Profile;
    reservations: Reservation[];
}

// Group reservations by profile
const groupedReservations = computed(() => {
    if (!props.reservations) return [];

    const grouped = new Map<number, ReservationGroup>();

    for (const reservation of props.reservations) {
        if (!reservation.createdBy) continue;

        const profileId = reservation.createdBy.id;
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

const onConfirmReservation = (reservationId: number) => {
    emit('confirm:reservation', reservationId);
};

const onConfirmProfile = (profileId: number) => {
    emit('confirm:profile', profileId);
};

const hasUnconfirmedReservations = (reservations: Reservation[]) => {
    return reservations.some((r) => !r.confirmedAt);
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
                <TableHead>Blok</TableHead>
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
                            {{ items.length }} reservering{{ items.length !== 1 ? 'en' : '' }}
                        </div>
                    </div>
                </div>

                <!-- Bulk Action -->
                <Button
                    v-if="hasUnconfirmedReservations(items)"
                    size="small"
                    @click.stop="onConfirmProfile(data.profile.id)"
                    :disabled="props.loading">
                    <FontAwesomeIcon :icon="faCheckDouble" class="mr-2" />
                    Alles bevestigen
                </Button>
            </div>
        </template>

        <template #row="{ data }">
            <TableCell>
                {{ timeToString(data.startTime) }} - {{ timeToString(data.endTime) }}
            </TableCell>
            <TableCell> Blok {{ data.blockIndex + 1 }} </TableCell>
            <TableCell>
                <span
                    v-if="data.confirmedAt"
                    class="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    <FontAwesomeIcon :icon="faCheck" class="mr-1" />
                    Bevestigd
                </span>
                <span
                    v-else
                    class="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                    In afwachting
                </span>
            </TableCell>
            <TableCell>
                <div class="flex justify-center">
                    <ActionMenu :is-pending="props.isReservationPending?.(data.id)">
                        <template #content="{ hideMenu }">
                            <Button
                                v-if="!data.confirmedAt"
                                text
                                severity="secondary"
                                class="w-full justify-start"
                                @click="
                                    () => {
                                        onConfirmReservation(data.id);
                                        hideMenu();
                                    }
                                ">
                                <FontAwesomeIcon :icon="faCheck" class="mr-2" />
                                Bevestigen
                            </Button>
                            <div v-else class="px-2 py-1 text-xs text-slate-500">Al bevestigd</div>
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
