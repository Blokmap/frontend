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

/**
 * Get the currently selected option.
 */
const selectedOption = computed<SelectOption<T> | undefined>(() => {
    return props.options.find((opt) => opt.value === props.value);
});
</script>

<template>
    <div>
        <label class="mb-1 block text-sm font-medium text-gray-700">
            {{ label }}
        </label>
        <Select
            :model-value="value"
            :options="options"
            :loading="loading"
            :placeholder="placeholder"
            @update:model-value="emit('change', $event)">
            <template #option="{ option }">
                <div class="flex items-center gap-2 text-sm">
                    <FontAwesomeIcon v-if="option.icon" :icon="option.icon" />
                    <span>{{ option.label }}</span>
                </div>
            </template>
            <template #value>
                <div v-if="selectedOption" class="flex items-center gap-2 text-sm">
                    <FontAwesomeIcon v-if="selectedOption.icon" :icon="selectedOption.icon" />
                    <span>{{ selectedOption.label }}</span>
                </div>
            </template>
        </Select>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
