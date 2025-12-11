<script lang="ts" setup>
import Skeleton from 'primevue/skeleton';
import { computed } from 'vue';
import { RouterLink, type RouteLocationRaw } from 'vue-router';

const props = withDefaults(
    defineProps<{
        to?: RouteLocationRaw;
        active?: boolean;
        compact?: boolean;
        loading?: boolean;
    }>(),
    {
        compact: true,
    },
);

defineEmits<{
    click: void;
}>();

const component = computed(() => (props.to ? RouterLink : 'div'));
</script>

<template>
    <Skeleton v-if="loading" class="item-skeleton" :class="{ 'item-skeleton--compact': compact }" />
    <component
        v-else
        class="item"
        :class="{ 'item--active': active, 'item--compact': compact }"
        :is="component"
        :to="to">
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

.item-skeleton {
    @apply !h-[72px] w-full rounded-lg;

    &.item-skeleton--compact {
        @apply !h-[40px];
    }
}

.item {
    @apply flex items-center gap-3 px-4 py-3;
    @apply cursor-pointer rounded-lg transition-all hover:bg-slate-100;

    &.item--active {
        @apply bg-slate-100;
    }

    &.item--compact {
        @apply px-3 py-2;

        .item__img {
            @apply !h-8 !w-8 text-lg;
        }

        .item__text {
            @apply text-sm;
        }
    }

    .item__img {
        @apply flex h-10 w-10 shrink-0 items-center justify-center text-xl text-slate-800;
    }

    .item__text {
        @apply w-full truncate font-bold;
    }
}
</style>
