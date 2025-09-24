<script lang="ts" setup>
import Button from 'primevue/button';
import Popover from 'primevue/popover';
import Select, { type SelectChangeEvent } from 'primevue/select';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { faCheck, faEllipsisH, faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, ref, useTemplateRef } from 'vue';
import LocationConfirmationDialog from './LocationConfirmationDialog.vue';
import type { Location, LocationState } from '@/domain/location';

const props = defineProps<{
    location: Location;
    isPending?: boolean;
}>();

const emit = defineEmits<{
    'change:status': [locationId: number, status: LocationState];
}>();

const actionMenu = useTemplateRef('menu');
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

const onToggleActionMenu = (event: Event) => {
    event.stopPropagation();
    actionMenu.value?.toggle(event);
};

const onConfirmRejection = () => {
    if (props.location.state !== 'rejected') {
        emit('change:status', props.location.id, 'rejected');
    }
    showRejectionDialog.value = false;
};

const onCancelRejection = () => {
    showRejectionDialog.value = false;
};

const onStatusChange = async (event: SelectChangeEvent) => {
    const state = event.value as LocationState;

    if (state && state !== props.location.state) {
        actionMenu.value?.hide();

        if (state === 'rejected') {
            showRejectionDialog.value = true;
            return;
        }

        emit('change:status', props.location.id, state);
    }
};
</script>

<template>
    <div>
        <slot name="trigger" :toggle="onToggleActionMenu">
            <Button
                severity="contrast"
                aria-haspopup="true"
                :aria-controls="`location-actions-${location.id}`"
                @click="onToggleActionMenu"
                text>
                <template #icon>
                    <FontAwesomeIcon :icon="faEllipsisH" v-if="!isPending" />
                    <FontAwesomeIcon :icon="faSpinner" spin v-else />
                </template>
            </Button>
        </slot>

        <Popover ref="menu" :id="`location-actions-${location.id}`">
            <div class="p-1">
                <p class="mb-3 text-sm font-medium text-slate-500">Acties</p>
                <div class="space-y-2">
                    <div>
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
                            @change="onStatusChange">
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
                </div>
            </div>
        </Popover>

        <LocationConfirmationDialog
            v-model:visible="showRejectionDialog"
            :location="location"
            @click:confirm="onConfirmRejection"
            @click:cancel="onCancelRejection">
        </LocationConfirmationDialog>
    </div>
</template>
