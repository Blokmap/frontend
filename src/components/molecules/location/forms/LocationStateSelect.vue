<script lang="ts" setup>
import Select from 'primevue/select';
import InputLabel from '@/components/atoms/form/InputLabel.vue';
import { faChartBar, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { LOCATION_STATE_ICONS, LOCATION_STATES, LocationState } from '@/domain/location';
import LocationStateBadge from '../details/LocationStateBadge.vue';
import type { FilterOption } from '@/utils/filter';

withDefaults(
    defineProps<{
        label?: string;
        clearable?: boolean;
        loading?: boolean;
        placeholder?: string;
    }>(),
    {
        label: 'Status',
        clearable: true,
        loading: false,
    },
);

const { t } = useI18n();

const status = defineModel<LocationState | null>('state', {
    default: null,
});

const options = computed<FilterOption[]>(() => {
    return LOCATION_STATES.map((state: LocationState) => {
        return {
            label: t('domains.locations.state.' + state),
            value: state,
            icon: LOCATION_STATE_ICONS[state],
        };
    });
});

const selectedOption = computed(() => {
    return options.value.find((opt) => opt.value === status.value) || null;
});
</script>

<template>
    <div class="state-select">
        <InputLabel v-if="label" html-for="state">
            {{ label }}
        </InputLabel>
        <Select
            label-id="state"
            class="state-select__select"
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
                        <FontAwesomeIcon
                            class="text-slate-400"
                            v-if="loading"
                            :icon="faSpinner"
                            spin>
                        </FontAwesomeIcon>
                        <LocationStateBadge :state="value" />
                    </template>
                    <template v-else>
                        <FontAwesomeIcon class="text-gray-400" :icon="faChartBar" />
                        <span class="text-slate-500">
                            {{ placeholder ?? 'Selecteer een status' }}
                        </span>
                    </template>
                </div>
            </template>
        </Select>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.state-select {
    @apply flex flex-col;

    .state-select__select {
        @apply w-auto min-w-[275px];
    }
}
</style>
