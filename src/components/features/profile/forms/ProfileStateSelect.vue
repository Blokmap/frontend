<script lang="ts" setup>
import Select from 'primevue/select';
import { faUser, faUserSlash, faTrash, faChartBar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';
import { ProfileState } from '@/domain/profile';
import type { FilterOption } from '@/utils/filter';

const status = defineModel<ProfileState | null>('status', {
    default: null,
});

const options: FilterOption[] = [
    { label: 'Actief', value: ProfileState.Active, icon: faUser },
    { label: 'Uitgeschakeld', value: ProfileState.Disabled, icon: faUserSlash },
    { label: 'Verwijderd', value: ProfileState.Deleted, icon: faTrash },
];

const selectedOption = computed(() => {
    return options.find((opt) => opt.value === status.value) || null;
});
</script>

<template>
    <Select
        class="w-auto min-w-[275px]"
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
