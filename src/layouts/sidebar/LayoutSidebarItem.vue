<script lang="ts" setup>
import Skeleton from 'primevue/skeleton';
import { computed } from 'vue';
import { RouterLink, useRoute, type RouteLocationAsRelativeGeneric } from 'vue-router';

const props = withDefaults(
    defineProps<{
        to?: RouteLocationAsRelativeGeneric;
        active?: boolean;
        compact?: boolean;
        loading?: boolean;
        disabled?: boolean;
    }>(),
    {
        compact: true,
        active: undefined,
    },
);

defineEmits<{
    click: [];
}>();

const route = useRoute();

const component = computed(() => {
    return props.to && !props.disabled ? RouterLink : 'div';
});

const active = computed<boolean>(() => {
    if (props.active !== undefined) {
        return props.active;
    }

    return !!(route.name && route.name === props.to?.name);
});
</script>

<template>
    <Skeleton v-if="loading" class="item-skeleton" :class="{ 'item-skeleton--compact': compact }" />
    <Transition v-else name="fade-slide-right" appear>
        <component
            class="item"
            :class="{
                'item--active': active,
                'item--compact': compact,
                'item--disabled': disabled,
            }"
            :is="component"
            :to="to">
            <div class="item__img">
                <slot name="img"></slot>
            </div>
            <div class="item__text">
                <slot name="text"></slot>
            </div>
        </component>
    </Transition>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.item-skeleton {
    @apply !h-[72px] w-full rounded-lg;

    &.item-skeleton--compact {
        @apply !h-[48px];
    }
}

.item {
    @apply flex items-center gap-3 px-4 py-3;
    @apply cursor-pointer rounded-lg transition-all hover:bg-slate-100;

    &.item--active {
        @apply bg-slate-100;
    }

    &.item--disabled {
        @apply cursor-not-allowed opacity-50;
        @apply hover:bg-transparent;
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
        @apply text-primary-600 flex h-10 w-10 shrink-0 items-center justify-center text-xl;
    }

    .item__text {
        @apply text-primary-950 w-full truncate font-bold;
    }
}
</style>
