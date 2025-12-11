<script lang="ts" setup>
import Select from 'primevue/select';
import EntityAvatar from '@/components/shared/molecules/avatar/EntityAvatar.vue';
import { faBuilding } from '@fortawesome/free-solid-svg-icons';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Institution } from '@/domain/institution';

const props = withDefaults(
    defineProps<{
        institutions: Institution[];
        disabled?: boolean;
        placeholder?: string;
        clearable?: boolean;
    }>(),
    {
        disabled: false,
        placeholder: 'Selecteer een organisatie',
        clearable: false,
    },
);

const institutionId = defineModel<number | null>();

const { locale } = useI18n();

const optionsWithClear = computed(() => {
    if (!props.clearable) return props.institutions;
    return [
        {
            id: null,
            name: { nl: 'Geen Organisatie', en: 'No Organization', fr: 'Aucune Organisation' },
            logo: null,
        },
        ...props.institutions,
    ];
});

const selectedInstitution = computed(() => {
    return props.institutions.find((i) => i.id === institutionId.value) || null;
});
</script>

<template>
    <Select
        v-model="institutionId"
        class="w-full"
        :options="optionsWithClear"
        :disabled="disabled"
        :placeholder="placeholder"
        option-value="id"
        :show-clear="!clearable">
        <template #option="{ option }">
            <div class="flex items-center gap-2">
                <EntityAvatar
                    class="h-6 w-6"
                    :image="option.logo?.url"
                    :icon="faBuilding"
                    :circle="false">
                </EntityAvatar>
                <span>{{ option.name[locale] }}</span>
            </div>
        </template>
        <template #value="{ value }">
            <div v-if="value && selectedInstitution" class="flex items-center gap-2">
                <EntityAvatar
                    class="h-6 w-6"
                    :image="selectedInstitution.logo?.url"
                    :icon="faBuilding"
                    :circle="false">
                </EntityAvatar>
                <span>{{ selectedInstitution.name[locale] }}</span>
            </div>
            <span v-else class="text-slate-500">{{ placeholder }}</span>
        </template>
    </Select>
</template>
