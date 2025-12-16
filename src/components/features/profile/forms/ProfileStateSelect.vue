<script lang="ts" setup>
import Select from 'primevue/select';
import {
    faUser,
    faUserSlash,
    faTrash,
    faChartBar,
    faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';
import { ProfileState } from '@/domain/profile';
import ProfileStateBadge from '../ProfileStateBadge.vue';
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

const status = defineModel<ProfileState | null>('state', {
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
        <template #option="{ option }">
            <ProfileStateBadge :state="option.value" />
        </template>
        <template #value="{ value }">
            <div class="flex items-center gap-3">
                <template v-if="value && selectedOption">
                    <FontAwesomeIcon class="text-slate-400" v-if="loading" :icon="faSpinner" spin />
                    <span>Status</span> <ProfileStateBadge :state="value" />
                </template>
                <template v-else>
                    <FontAwesomeIcon class="text-gray-400" :icon="faChartBar" />
                    <span class="text-slate-500">{{ placeholder ?? 'Selecteer een status' }}</span>
                </template>
            </div>
        </template>
    </Select>
</template>
