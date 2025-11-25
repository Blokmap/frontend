<script lang="ts" setup>
import { computed } from 'vue';
import { RouterLink, type RouteLocationRaw } from 'vue-router';

const props = defineProps<{
    to?: RouteLocationRaw;
    active?: boolean;
}>();

defineEmits<{
    (e: 'click'): [];
}>();

const component = computed(() => (props.to ? RouterLink : 'div'));
</script>

<template>
    <component class="item" :class="{ 'item--active': active }" :is="component" :to="to">
        <div class="item__img">
            <slot name="img"></slot>
        </div>
        <div class="item__text">
            <slot name="text"></slot>
        </div>
    </component>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.item {
    @apply flex items-center gap-3 px-4 py-3;
    @apply cursor-pointer rounded-lg transition-all hover:bg-slate-100;

    &.item--active {
        @apply bg-slate-100 dark:bg-gray-700;
    }

    .item__img {
        @apply flex h-12 w-12 shrink-0 items-center justify-center text-xl;
        @apply shadow-playful rounded-full bg-slate-100 object-fill text-slate-700;
        --shadow-color: var(--color-slate-300);
    }

    .item__text {
        @apply w-full font-bold;
    }
}
</style>
