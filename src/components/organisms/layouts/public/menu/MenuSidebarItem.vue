<script lang="ts" setup>
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';
import { RouterLink, type RouteLocationAsRelativeGeneric } from 'vue-router';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

const props = defineProps<{
    label?: string;
    to?: RouteLocationAsRelativeGeneric;
    href?: string;
    icon: IconDefinition;
}>();

const component = computed(() => {
    if (props.to) {
        return RouterLink;
    }

    if (props.href) {
        return 'a';
    }

    return 'div';
});
</script>

<template>
    <component :is="component" :to="to" :href="href" class="menu-item">
        <div class="menu-item__label-group">
            <FontAwesomeIcon class="menu-item__icon" :icon="icon" />
            <slot>{{ label }}</slot>
        </div>
        <slot name="end">
            <FontAwesomeIcon class="menu-item__icon icon--muted" :icon="faChevronRight" />
        </slot>
    </component>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.menu-item {
    @apply flex items-center justify-between gap-3;
    @apply cursor-pointer text-lg;

    .menu-item__icon {
        @apply text-lg text-slate-600;

        &.icon--muted {
            @apply text-base text-slate-400;
        }
    }

    .menu-item__label-group {
        @apply flex items-center gap-3;
    }
}
</style>
