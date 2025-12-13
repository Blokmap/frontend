<script lang="ts" setup>
import ActionMenu from '@/components/shared/atoms/menu/ActionMenu.vue';
import ActionMenuButton from '@/components/shared/atoms/menu/ActionMenuButton.vue';
import ActionMenuSelect from '@/components/shared/atoms/menu/ActionMenuSelect.vue';
import ConfirmDialog from '@/components/shared/molecules/ConfirmDialog.vue';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { faEdit, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import {
    LOCATION_STATE_ICONS,
    LOCATION_STATES,
    LocationState,
    type Location,
} from '@/domain/location';
import LocationConfirmationDialog from './LocationConfirmationDialog.vue';

const props = withDefaults(
    defineProps<{
        location: Location;
        pending?: boolean;
        showStateSelect?: boolean;
        showEdit?: boolean;
        showReservations?: boolean;
        showDelete?: boolean;
    }>(),
    {
        showStateSelect: true,
        showEdit: true,
        showReservations: true,
        showDelete: true,
    },
);

const emit = defineEmits<{
    'select:state': [id: number, status: LocationState, reason?: string];
    'click:delete': [id: number, hideDeleteDialog: () => void];
}>();

const { t } = useI18n();

const showRejectionDialog = ref(false);
const showDeleteDialog = ref(false);

const statusOptions = computed(() => {
    return LOCATION_STATES.map((state) => ({
        label: t(`domains.locations.state.${state}`),
        value: state,
        icon: LOCATION_STATE_ICONS[state],
    }));
});

/**
 * Handle state selection change.
 *
 * @param state - The selected location state
 */
function onStateSelect(state: LocationState): void {
    if (state === LocationState.Rejected) {
        showRejectionDialog.value = true;
        return;
    }

    emit('select:state', props.location.id, state);
}

/**
 * Confirm location rejection and emit status change.
 */
function onConfirmRejection(reason: string): void {
    if (props.location.state !== LocationState.Rejected) {
        emit('select:state', props.location.id, LocationState.Rejected, reason);
    }

    showRejectionDialog.value = false;
}

/**
 * Cancel location rejection dialog.
 */
function onCancelRejection(): void {
    showRejectionDialog.value = false;
}

/**
 * Confirm location deletion and emit delete event.
 */
function onConfirmDeletion(): void {
    emit('click:delete', props.location.id, () => {
        showDeleteDialog.value = false;
    });
}

/**
 * Cancel location deletion dialog.
 */
function onCancelDeletion(): void {
    showDeleteDialog.value = false;
}

/**
 * Handle delete location click.
 */
function onDeleteClick(): void {
    showDeleteDialog.value = true;
}

/**
 * Close dialog when deletion completes successfully.
 */
watch(
    () => props.pending,
    (isPending, wasPending) => {
        if (wasPending && !isPending && showDeleteDialog.value) {
            showDeleteDialog.value = false;
        }
    },
);
</script>

<template>
    <ActionMenu :pending="pending">
        <template #trigger="{ toggle }">
            <slot name="trigger" :toggle="toggle">
                <!-- Default trigger is provided by ActionMenu -->
            </slot>
        </template>

        <template #content>
            <ActionMenuSelect
                v-if="showStateSelect"
                :value="props.location.state"
                :options="statusOptions"
                :loading="pending"
                label="Status wijzigen"
                placeholder="Selecteer nieuwe status"
                @change="onStateSelect">
            </ActionMenuSelect>
        </template>

        <template #navigation>
            <ActionMenuButton
                v-if="showEdit"
                label="Beheren"
                :icon="faEdit"
                :to="{
                    name: 'dashboard.locations.detail.info',
                    params: { locationId: props.location.id },
                }">
            </ActionMenuButton>

            <ActionMenuButton
                v-if="showReservations"
                label="Reservaties"
                :icon="faCalendarAlt"
                :to="{
                    name: 'dashboard.locations.detail.reservations',
                    params: { locationId: props.location.id },
                }">
            </ActionMenuButton>

            <ActionMenuButton
                v-if="showDelete"
                label="Verwijderen"
                :icon="faTrashCan"
                @click="onDeleteClick"
                destructive>
            </ActionMenuButton>
        </template>
    </ActionMenu>

    <Teleport to="body">
        <LocationConfirmationDialog
            v-if="showStateSelect"
            v-model:visible="showRejectionDialog"
            :location="location"
            @click:confirm="onConfirmRejection"
            @click:cancel="onCancelRejection">
        </LocationConfirmationDialog>

        <ConfirmDialog
            v-model:visible="showDeleteDialog"
            title="Locatie verwijderen"
            confirm-label="Verwijderen"
            :loading="pending"
            @click:confirm="onConfirmDeletion"
            @click:cancel="onCancelDeletion"
            destructive>
            <template #content>
                <p class="text-gray-600">
                    Weet je zeker dat je <strong>"{{ location.name }}"</strong> wilt verwijderen?
                    Deze actie kan niet ongedaan worden gemaakt. Naast de locatie wordt ook het
                    volgende wordt verwijderd:
                </p>
                <ul class="list-inside list-disc space-y-1 ps-3 text-gray-600">
                    <li>Alle bijbehorende <strong>afbeeldingen</strong></li>
                    <li>Alle bijbehorende <strong>reservaties</strong></li>
                    <li>Alle bijbehorende <strong>openingstijden</strong></li>
                    <li>Alle bijbehorende <strong>reviews</strong></li>
                </ul>
            </template>
        </ConfirmDialog>
    </Teleport>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
