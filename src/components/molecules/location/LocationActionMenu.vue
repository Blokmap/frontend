<script lang="ts" setup>
import ActionMenu from '@/components/atoms/menu/ActionMenu.vue';
import ActionMenuButton from '@/components/atoms/menu/ActionMenuButton.vue';
import ConfirmDialog from '@/components/molecules/ConfirmDialog.vue';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { faEdit, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { computed, ref, watch } from 'vue';
import { LocationState, type Location } from '@/domain/location';
import LocationConfirmationDialog from './LocationConfirmationDialog.vue';
import LocationStateSelect from './forms/LocationStateSelect.vue';

type LocationActionMenuEmits = {
    'select:state': [id: number, status: LocationState, reason?: string];
    'click:delete': [id: number];
    'click:reservations': [id: number];
    'click:edit': [id: number];
};

type LocationAction = keyof LocationActionMenuEmits;

type LocationActionMenuProps = {
    location: Location;
    actions?: LocationAction[];
    pendingActions?: Partial<Record<LocationAction, boolean>>;
};

const props = withDefaults(defineProps<LocationActionMenuProps>(), {
    actions: () => {
        return ['select:state', 'click:delete', 'click:reservations', 'click:edit'];
    },
});

const emit = defineEmits<LocationActionMenuEmits>();

const visible = ref<boolean>(false);
const showRejectionDialog = ref<boolean>(false);
const showDeleteDialog = ref<boolean>(false);

const onStateSelect = (state: LocationState | null): void => {
    if (state === null) {
        return;
    }

    if (state === LocationState.Rejected) {
        showRejectionDialog.value = true;
        return;
    }

    emit('select:state', props.location.id, state);
};

const onConfirmRejection = (reason: string): void => {
    if (props.location.state !== LocationState.Rejected) {
        emit('select:state', props.location.id, LocationState.Rejected, reason);
    }

    showRejectionDialog.value = false;
};

const onCancelRejection = (): void => {
    showRejectionDialog.value = false;
};

const onConfirmDeletion = (): void => {
    emit('click:delete', props.location.id);
};

const onCancelDeletion = (): void => {
    showDeleteDialog.value = false;
};

const onDeleteClick = (): void => {
    showDeleteDialog.value = true;
};

const actionPending = (action: LocationAction): boolean => {
    return props.pendingActions?.[action] ?? false;
};

const pending = computed<boolean>(() => {
    return Object.values(props.pendingActions ?? {}).some((isPending) => isPending);
});

watch(pending, (isPending, wasPending) => {
    if (wasPending && !isPending) {
        visible.value = false;
        showRejectionDialog.value = false;
        showDeleteDialog.value = false;
    }
});
</script>

<template>
    <ActionMenu :pending="pending" v-model:visible="visible">
        <template #trigger="{ toggle }">
            <slot name="trigger" :toggle="toggle">
                <!-- Default trigger is provided by ActionMenu -->
            </slot>
        </template>

        <template #content>
            <LocationStateSelect
                :state="location.state"
                :clearable="false"
                :loading="actionPending('select:state')"
                @update:state="onStateSelect">
            </LocationStateSelect>
        </template>

        <template #navigation>
            <ActionMenuButton
                v-if="actions.includes('click:edit')"
                label="Beheren"
                :icon="faEdit"
                :to="{
                    name: 'manage.location.info',
                    params: { locationId: props.location.id },
                }">
            </ActionMenuButton>

            <ActionMenuButton
                v-if="actions.includes('click:reservations')"
                label="Reservaties"
                :icon="faCalendarAlt"
                :to="{
                    name: 'manage.location.reservations',
                    params: { locationId: props.location.id },
                }">
            </ActionMenuButton>

            <ActionMenuButton
                v-if="actions.includes('click:delete')"
                label="Verwijderen"
                :icon="faTrashCan"
                :loading="actionPending('click:delete')"
                @click="onDeleteClick"
                destructive>
            </ActionMenuButton>
        </template>
    </ActionMenu>

    <Teleport to="body">
        <LocationConfirmationDialog
            v-if="actions.includes('select:state')"
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
