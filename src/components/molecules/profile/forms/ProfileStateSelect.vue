<script lang="ts" setup>
import Select from 'primevue/select';
import { faChartBar, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { ProfileState } from '@/domain/profile';
import { PROFILE_STATE_ICONS, PROFILE_STATES } from '@/domain/profile/profileConstants';
import InputLabel from '../../form/InputLabel.vue';
import ProfileStateBadge from '../ProfileStateBadge.vue';
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

const status = defineModel<ProfileState | null>('state', {
    default: null,
});

const { t } = useI18n();

const options = computed<FilterOption[]>(() => {
    return PROFILE_STATES.map((state: ProfileState) => {
        return {
            label: t('domains.locations.state.' + state),
            value: state,
            icon: PROFILE_STATE_ICONS[state],
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
            class="state-select__select"
            v-model="status"
            label-id="state"
            option-label="label"
            option-value="value"
            :options="options"
            show-clear>
            <template #option="{ option }">
                <ProfileStateBadge :state="option.value" />
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
                        <ProfileStateBadge :state="value" />
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
