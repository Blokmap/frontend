<template>
    <Select
        class="min-w-[250px]"
        v-model="status"
        :options="options"
        option-label="label"
        option-value="value"
        show-clear>
        <template #filtericon>
            <FontAwesomeIcon :icon="faChartBar" />
        </template>
        <template #option="{ option }">
            <div class="flex items-center gap-2">
                <FontAwesomeIcon :icon="option.icon" />
                <span>{{ option.label }}</span>
            </div>
        </template>
        <template #value="{ value }">
            <div class="flex items-center gap-3">
                <template v-if="value && selectedOption">
                    <FontAwesomeIcon :icon="selectedOption.icon || faChartBar" />
                    <span>{{ selectedOption.label }}</span>
                </template>
                <template v-else>
                    <FontAwesomeIcon class="text-gray-400" :icon="faChartBar" />
                    <span class="text-slate-500">Filter op status</span>
                </template>
            </div>
        </template>
    </Select>
</template>

<script lang="ts" setup>
import Select from 'primevue/select';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { faChartBar, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';
import type { LocationState } from '@/domain/location';
import type { FilterOption } from '@/domain/shared/types/filter';

const status = defineModel<LocationState | null>('status', {
    default: null,
});

const options: FilterOption[] = [
    { label: 'In Afwachting', value: 'pending', icon: faClock },
    { label: 'Goedgekeurd', value: 'approved', icon: faCheck },
    { label: 'Afgekeurd', value: 'rejected', icon: faTimes },
];

const selectedOption = computed(() => {
    return options.find((opt) => opt.value === status.value) || null;
});
</script>
