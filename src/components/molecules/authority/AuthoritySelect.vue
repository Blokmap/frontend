<script lang="ts" setup>
import Select from 'primevue/select';
import EntityAvatar from '@/components/molecules/avatar/EntityAvatar.vue';
import { faSitemap } from '@fortawesome/free-solid-svg-icons';
import { computed } from 'vue';
import type { Authority } from '@/domain/authority';

const props = withDefaults(
    defineProps<{
        authorities: Authority[];
        disabled?: boolean;
        placeholder?: string;
        clearable?: boolean;
    }>(),
    {
        loading: false,
        disabled: false,
        placeholder: 'Selecteer een autoriteit',
        clearable: false,
    },
);

const authorityId = defineModel<number | null>();

const optionsWithClear = computed(() => {
    if (!props.clearable) return props.authorities;
    return [{ id: null, name: 'Geen Groep', logo: null }, ...props.authorities];
});

const selectedAuthority = computed(() => {
    return props.authorities.find((a) => a.id === authorityId.value) || null;
});
</script>

<template>
    <Select
        v-model="authorityId"
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
                    :icon="faSitemap"
                    :circle="false">
                </EntityAvatar>
                <span>{{ option.name }}</span>
            </div>
        </template>
        <template #value="{ value }">
            <div v-if="value && selectedAuthority" class="flex items-center gap-2">
                <EntityAvatar
                    class="h-6 w-6"
                    :image="selectedAuthority.logo?.url"
                    :icon="faSitemap"
                    :circle="false">
                </EntityAvatar>
                <span>{{ selectedAuthority.name }}</span>
            </div>
            <span v-else class="text-slate-500">{{ placeholder }}</span>
        </template>
    </Select>
</template>
