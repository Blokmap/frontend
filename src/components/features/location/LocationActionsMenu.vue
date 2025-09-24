<script lang="ts" setup>
import Button from 'primevue/button';
import Popover from 'primevue/popover';
import Select from 'primevue/select';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { faEllipsisH, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useTemplateRef, computed } from 'vue';
import type { Location, LocationState } from '@/domain/location';

const props = defineProps<{
    location: Location;
}>();

const emit = defineEmits<{
    'change:status': [locationId: number, status: LocationState];
}>();

const actionMenu = useTemplateRef('menu');

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

const onStatusChange = (event: any) => {
    const newStatus = event.value as LocationState;

    if (newStatus && newStatus !== props.location.state) {
        emit('change:status', props.location.id, newStatus);
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
                    <FontAwesomeIcon :icon="faEllipsisH" />
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
    </div>
</template>
