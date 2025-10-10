<script lang="ts" setup>
import Select, { type SelectChangeEvent } from 'primevue/select';
import ActionMenu from '@/components/shared/atoms/ActionMenu.vue';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { faCheck, faTimes, faEye, faEdit, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, ref } from 'vue';
import LocationConfirmationDialog from './LocationConfirmationDialog.vue';
import type { Location, LocationState } from '@/domain/location';

const props = withDefaults(
    defineProps<{
        location: Location;
        isPending?: boolean;
        showStatusChange?: boolean;
    }>(),
    {
        showStatusChange: true,
    },
);

const emit = defineEmits<{
    'change:status': [locationId: number, status: LocationState];
}>();

const showRejectionDialog = ref(false);

const statusOptions = computed(() => {
    return [
        { label: 'In Afwachting', value: 'pending', icon: faClock },
        { label: 'Goedgekeurd', value: 'approved', icon: faCheck },
        { label: 'Afgekeurd', value: 'rejected', icon: faTimes },
    ];
});

const selectedOption = computed(() => {
    return statusOptions.value.find((opt) => opt.value === props.location.state) || null;
});

const navigationActions = [
    {
        label: 'Bekijk Details',
        icon: faEye,
        to: { name: 'locations.detail', params: { locationId: props.location.id } },
    },
    {
        label: 'Bewerken',
        icon: faEdit,
        action: () => {
            console.log('Edit location:', props.location.id);
            // TODO: Navigate to edit page when route exists
            // router.push({ name: 'locations.edit', params: { locationId: props.location.id } });
        },
    },
    {
        label: 'Reservaties Bekijken',
        icon: faCalendarAlt,
        action: () => {
            console.log('View reservations for location:', props.location.id);
            // TODO: Navigate to reservations page when route exists
            // router.push({ name: 'locations.reservations', params: { locationId: props.location.id } });
        },
    },
];

const onConfirmRejection = () => {
    if (props.location.state !== 'rejected') {
        emit('change:status', props.location.id, 'rejected');
    }
    showRejectionDialog.value = false;
};

const onCancelRejection = () => {
    showRejectionDialog.value = false;
};

const onStatusChange = async (event: SelectChangeEvent, hideMenu: () => void) => {
    const state = event.value as LocationState;

    if (state && state !== props.location.state) {
        hideMenu();

        if (state === 'rejected') {
            showRejectionDialog.value = true;
            return;
        }

        emit('change:status', props.location.id, state);
    }
};
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
                            <div class="flex items-center gap-2">
                                <FontAwesomeIcon :icon="option.icon" />
                                <span>{{ option.label }}</span>
                            </div>
                        </template>
                        <template #value="{ value }">
                            <div v-if="value && selectedOption" class="flex items-center gap-2">
                                <FontAwesomeIcon :icon="selectedOption.icon" />
                                <span>{{ selectedOption.label }}</span>
                            </div>
                        </template>
                    </Select>
                </div>

                <!-- Navigation Actions -->
                <div
                    class="space-y-1 border-t border-slate-200 pt-2"
                    :class="{ 'border-t-0 pt-0': !showStatusChange }">
                    <template v-for="action in navigationActions" :key="action.label">
                        <RouterLink
                            v-if="action.to"
                            :to="action.to"
                            class="flex w-full items-center gap-3 rounded-md px-2 py-1 text-sm text-slate-700 transition-colors hover:bg-slate-100"
                            @click="hideMenu">
                            <FontAwesomeIcon :icon="action.icon" class="text-slate-700" />
                            <span>{{ action.label }}</span>
                        </RouterLink>
                        <button
                            v-else
                            class="flex w-full items-center gap-3 rounded-md px-2 py-1 text-sm text-slate-700 transition-colors hover:bg-slate-100"
                            @click="
                                action.action?.();
                                hideMenu();
                            ">
                            <FontAwesomeIcon :icon="action.icon" class="text-slate-700" />
                            <span>{{ action.label }}</span>
                        </button>
                    </template>
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
</template>
