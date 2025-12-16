<script lang="ts" setup>
import Select from 'primevue/select';
import { faChartBar, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';
import { LOCATION_STATE_ICONS, LocationState } from '@/domain/location';
import LocationStateBadge from '../details/LocationStateBadge.vue';
import type { FilterOption } from '@/utils/filter';

withDefaults(
    defineProps<{
        clearable?: boolean;
        loading?: boolean;
        placeholder?: string;
    }>(),
    {
        clearable: true,
        loading: false,
    },
);

const status = defineModel<LocationState | null>('state', {
    default: null,
});

const options: FilterOption[] = [
    {
        label: 'In Afwachting',
        value: LocationState.Pending,
        icon: LOCATION_STATE_ICONS[LocationState.Pending],
    },
    {
        label: 'Goedgekeurd',
        value: LocationState.Approved,
        icon: LOCATION_STATE_ICONS[LocationState.Approved],
    },
    {
        label: 'Afgekeurd',
        value: LocationState.Rejected,
        icon: LOCATION_STATE_ICONS[LocationState.Rejected],
    },
];

const selectedOption = computed(() => {
    return options.find((opt) => opt.value === status.value) || null;
});
</script>

<template>
    <Select
        class="w-auto min-w-[275px]"
        :options="options"
        :show-clear="clearable"
        v-model="status"
        option-label="label"
        option-value="value">
        <template #option="{ option }">
            <LocationStateBadge :state="option.value" />
        </template>
        <template #value="{ value }">
            <div class="flex items-center gap-3">
                <template v-if="value && selectedOption">
                    <FontAwesomeIcon class="text-slate-400" v-if="loading" :icon="faSpinner" spin />
                    <span>Status</span> <LocationStateBadge :state="value" />
                </template>
                <template v-else>
                    <FontAwesomeIcon class="text-gray-400" :icon="faChartBar" />
                    <span class="text-slate-500">{{ placeholder ?? 'Selecteer een status' }}</span>
                </template>
            </div>
        </template>
    </Select>
</template>
