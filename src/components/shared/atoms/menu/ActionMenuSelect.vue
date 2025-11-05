<script lang="ts" setup generic="T">
import Select from 'primevue/select';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';
import type { SelectOption } from '.';

const props = withDefaults(
    defineProps<{
        value?: T;
        options: SelectOption<T>[];
        label: string;
        placeholder?: string;
        loading?: boolean;
    }>(),
    {
        placeholder: 'Selecteer een optie',
    },
);

const emit = defineEmits<{
    change: [value: T];
}>();

const selectedOption = computed<SelectOption<T> | undefined>(() => {
    return props.options.find((opt) => opt.value === props.value);
});
</script>

<template>
    <label class="mb-1 block text-sm font-medium text-gray-700">
        {{ label }}
    </label>
    <Select
        class="min-w-[200px]"
        :model-value="selectedOption"
        :options="options"
        :loading="loading"
        :placeholder="placeholder"
        @update:model-value="emit('change', $event.value)">
        <template #option="{ option }">
            <slot name="option" :option="option">
                <div class="flex items-center gap-2 text-sm">
                    <FontAwesomeIcon v-if="option.icon" :icon="option.icon" />
                    <span>{{ option.label }}</span>
                </div>
            </slot>
        </template>
        <template #value="{ value }">
            <div class="flex items-center gap-2 text-sm text-slate-800">
                <FontAwesomeIcon v-if="value.icon" :icon="value.icon" />
                <span>{{ value.label }}</span>
            </div>
        </template>
    </Select>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
