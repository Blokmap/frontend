<script lang="ts" generic="T" setup>
import { computed } from 'vue';

export type SelectButtonOption<T> = {
    label: string;
    value: T;
};

const props = defineProps<{
    options: SelectButtonOption<T>[];
}>();

const model = defineModel<T>();

const selectedIndex = computed(() => {
    return props.options.findIndex((opt) => opt.value === model.value);
});
</script>

<template>
    <div class="buttons">
        <div class="buttons__selector" :style="{ '--index': selectedIndex }"></div>
        <div
            v-for="(option, i) in options"
            class="buttons__button"
            :key="option.label"
            :class="{ active: i === selectedIndex }"
            @click="model = option.value">
            {{ option.label }}
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.buttons {
    @apply relative flex w-full rounded-lg bg-slate-50;

    .buttons__selector {
        @apply bg-primary-50 border-primary-200 absolute inset-y-0 left-0 rounded-lg border;
        @apply transition-transform duration-200 ease-in-out;
        @apply w-[calc(100%/v-bind('options.length'))] translate-x-[calc(var(--index)*100%)];
    }

    .buttons__button {
        @apply relative z-1 flex-1 py-2 text-center text-nowrap;
        @apply cursor-pointer font-normal transition-colors duration-200 ease-in-out;

        &.active {
            @apply text-primary-600;
        }
    }
}
</style>
