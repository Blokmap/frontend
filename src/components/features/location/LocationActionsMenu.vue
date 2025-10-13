<script lang="ts" setup>
import Select, { type SelectChangeEvent } from 'primevue/select';
import ActionMenu from '@/components/shared/atoms/ActionMenu.vue';
import ConfirmDialog from '@/components/shared/molecules/ConfirmDialog.vue';
import { faClock, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { faCheck, faTimes, faEdit, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, ref, watch } from 'vue';
import LocationConfirmationDialog from './LocationConfirmationDialog.vue';
import type { Location, LocationState } from '@/domain/location';

const props = withDefaults(
    defineProps<{
        location: Location;
        isPending?: boolean;
        deleteIsPending?: boolean;
        showStatusChange?: boolean;
    }>(),
    {
        showStatusChange: true,
    },
);

const emit = defineEmits<{
    'change:status': [locationId: number, status: LocationState];
    'click:delete': [locationId: number];
}>();

const showRejectionDialog = ref(false);
const showDeleteDialog = ref(false);

const statusOptions = computed(() => {
    return [
        { label: 'In Afwachting', value: 'pending', icon: faClock },
        { label: 'Goedgekeurd', value: 'approved', icon: faCheck },
        { label: 'Afgekeurd', value: 'rejected', icon: faTimes },
    ];
});

const selectedStatusOption = computed(() => {
    return statusOptions.value.find((opt) => opt.value === props.location.state) || null;
});

/**
 * Confirm location rejection and emit status change.
 */
function onConfirmRejection(): void {
    if (props.location.state !== 'rejected') {
        emit('change:status', props.location.id, 'rejected');
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
    emit('click:delete', props.location.id);
    // Don't close dialog here - parent will close it after successful deletion
}

/**
 * Cancel location deletion dialog.
 */
function onCancelDeletion(): void {
    showDeleteDialog.value = false;
}

/**
 * Handle status change from dropdown selection.
 * @param event The select change event.
 * @param hideMenu Function to hide the action menu.
 */
async function onStatusChange(event: SelectChangeEvent, hideMenu: () => void): Promise<void> {
    const state: LocationState = event.value;

    if (state && state !== props.location.state) {
        hideMenu();

        if (state === 'rejected') {
            showRejectionDialog.value = true;
            return;
        }

        emit('change:status', props.location.id, state);
    }
}

/**
 * Handle delete location click.
 * @param hideMenu Function to hide the action menu.
 */
function onDeleteClick(hideMenu: () => void): void {
    hideMenu();
    showDeleteDialog.value = true;
}

/**
 * Close dialog when deletion completes successfully.
 */
watch(
    () => props.deleteIsPending,
    (isPending, wasPending) => {
        // Close dialog when deletion finishes (isPending goes from true to false)
        if (wasPending && !isPending && showDeleteDialog.value) {
            showDeleteDialog.value = false;
        }
    },
);
</script>

<template>
    <ActionMenu :is-pending="isPending">
        <template #trigger="{ toggle }">
            <slot name="trigger" :toggle="toggle">
                <!-- Default trigger is provided by ActionMenu -->
            </slot>
        </template>

        <template #content="{ hideMenu }">
            <div class="space-y-4">
                <!-- Status Change Section -->
                <div v-if="showStatusChange">
                    <label class="mb-1 block text-sm font-medium text-gray-700">
                        Status wijzigen
                    </label>
                    <Select
                        :model-value="props.location.state"
                        :options="statusOptions"
                        :loading="isPending"
                        option-label="label"
                        option-value="value"
                        placeholder="Selecteer nieuwe status"
                        class="w-full min-w-[200px]"
                        @change="(event) => onStatusChange(event, hideMenu)">
                        <template #option="{ option }">
                            <div class="flex items-center gap-2 text-sm">
                                <FontAwesomeIcon :icon="option.icon" />
                                <span>{{ option.label }}</span>
                            </div>
                        </template>
                        <template #value="{ value }">
                            <div
                                v-if="value && selectedStatusOption"
                                class="flex items-center gap-2 text-sm">
                                <FontAwesomeIcon :icon="selectedStatusOption.icon" />
                                <span>{{ selectedStatusOption.label }}</span>
                            </div>
                        </template>
                    </Select>
                </div>

                <!-- Navigation Actions -->
                <div class="navigation" :class="{ 'border-t-0 pt-0': !showStatusChange }">
                    <RouterLink
                        class="navigation-link"
                        :to="{
                            name: 'dashboard.locations.detail',
                            params: { locationId: props.location.id },
                        }">
                        <FontAwesomeIcon :icon="faEdit" class="text-slate-700" />
                        <span>Beheren</span>
                    </RouterLink>

                    <button class="navigation-link">
                        <FontAwesomeIcon :icon="faCalendarAlt" class="text-slate-700" />
                        <span>Reservaties</span>
                    </button>

                    <button class="navigation-link destructive" @click="onDeleteClick(hideMenu)">
                        <FontAwesomeIcon :icon="faTrashCan" />
                        <span>Verwijderen</span>
                    </button>
                </div>
            </div>
        </template>
    </ActionMenu>

    <LocationConfirmationDialog
        v-if="showStatusChange"
        v-model:visible="showRejectionDialog"
        :location="location"
        @click:confirm="onConfirmRejection"
        @click:cancel="onCancelRejection">
    </LocationConfirmationDialog>

    <ConfirmDialog
        v-model:visible="showDeleteDialog"
        title="Locatie verwijderen"
        confirm-label="Verwijderen"
        :destructive="true"
        :loading="deleteIsPending"
        @click:confirm="onConfirmDeletion"
        @click:cancel="onCancelDeletion">
        <template #content>
            <p class="text-gray-600">
                Weet je zeker dat je <strong>"{{ location.name }}"</strong> wilt verwijderen? Deze
                actie kan niet ongedaan worden gemaakt. Naast de locatie wordt ook het volgende
                wordt verwijderd:
            </p>
            <ul class="list-inside list-disc space-y-1 ps-3 text-gray-600">
                <li>Alle bijbehorende <strong>afbeeldingen</strong></li>
                <li>Alle bijbehorende <strong>reservaties</strong></li>
                <li>Alle bijbehorende <strong>openingstijden</strong></li>
                <li>Alle bijbehorende <strong>reviews</strong></li>
            </ul>
        </template>
    </ConfirmDialog>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.navigation {
    @apply space-y-1 border-t border-slate-200 pt-2;
}

.navigation-link {
    @apply flex w-full items-center gap-3 px-2 py-1;
    @apply rounded-md text-sm text-slate-700 transition-colors hover:bg-slate-100;

    &.destructive {
        @apply text-red-700 hover:bg-red-50;
    }
}
</style>
