<script lang="ts" setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';

import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import type { RouteLocationRaw } from 'vue-router';

const props = defineProps<{
    icon: IconDefinition;
    label: string;
    to?: RouteLocationRaw;
    destructive?: boolean;
}>();

const emit = defineEmits<{
    click: [event: MouseEvent];
}>();

const isButton = computed(() => !props.to);

const handleClick = (event: MouseEvent) => {
    if (isButton.value) {
        emit('click', event);
    }
};
</script>

<template>
    <component
        :is="to ? 'RouterLink' : 'button'"
        :to="to"
        class="navigation-link"
        :class="{ destructive }"
        @click="handleClick">
        <FontAwesomeIcon :icon="icon" :class="destructive ? '' : 'text-slate-700'" />
        <span>{{ label }}</span>
    </component>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.navigation-link {
    @apply flex w-full items-center gap-3 px-2 py-1;
    @apply rounded-md text-sm text-slate-700 transition-colors hover:bg-slate-100;
    @apply cursor-pointer;

    &.destructive {
        @apply text-red-700 hover:bg-red-50;
    }
}
</style>
