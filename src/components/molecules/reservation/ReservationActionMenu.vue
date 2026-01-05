<script lang="ts" setup>
import ActionMenu from '@/components/atoms/menu/ActionMenu.vue';
import ActionMenuButton from '@/components/atoms/menu/ActionMenuButton.vue';
import ActionMenuSelect from '@/components/atoms/menu/ActionMenuSelect.vue';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import {
    RESERVATION_STATE_ICONS,
    RESERVATION_STATES,
    ReservationState,
    type Reservation,
} from '@/domain/reservation';

const _props = withDefaults(
    defineProps<{
        reservation: Reservation;
        pending?: boolean;
        showStateSelect?: boolean;
        showDelete?: boolean;
    }>(),
    {
        showStateSelect: true,
        showDelete: true,
    },
);

const emit = defineEmits<{
    'select:state': [newState: ReservationState];
    'click:delete': [];
}>();

const { t } = useI18n();

const statusOptions = computed(() => {
    return RESERVATION_STATES.filter((s) => s !== ReservationState.Pending).map((value) => ({
        label: t(`domains.reservations.state.${value}`),
        icon: RESERVATION_STATE_ICONS[value],
        value,
    }));
});

/**
 * Handle state selection change.
 *
 * @param newState - The selected reservation state
 */
function onStateSelect(newState: ReservationState): void {
    emit('select:state', newState);
}

/**
 * Handle delete button click.
 */
function onDeleteClick(): void {
    emit('click:delete');
}
</script>

<template>
    <ActionMenu :pending="pending">
        <template #trigger="{ toggle }">
            <slot name="trigger" :toggle="toggle"></slot>
        </template>

        <template #content>
            <ActionMenuSelect
                v-if="showStateSelect"
                :value="reservation.state"
                :options="statusOptions"
                :loading="pending"
                label="Status wijzigen"
                placeholder="Selecteer nieuwe status"
                @change="onStateSelect">
            </ActionMenuSelect>
            <ActionMenuButton
                v-if="showDelete"
                :icon="faTrash"
                label="Verwijderen"
                destructive
                @click="onDeleteClick">
            </ActionMenuButton>
        </template>
    </ActionMenu>
</template>
