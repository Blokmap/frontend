<script lang="ts" setup>
import EntityAvatar from '@/components/molecules/avatar/EntityAvatar.vue';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

defineProps<{
    to: { name: string; params?: Record<string, string | number> };
    label: string;
    name?: string | null;
    logo?: string;
    icon?: IconDefinition;
}>();
</script>

<template>
    <RouterLink :to="to" class="access-link">
        <EntityAvatar class="link__avatar" :image="logo" :icon="icon" circle />

        <div class="link__content">
            <span class="link__content__label">
                {{ label }}
            </span>
            <p class="link__content__name">
                {{ name }}
            </p>
        </div>

        <FontAwesomeIcon :icon="faArrowRight" />
    </RouterLink>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.access-link {
    @apply flex items-center gap-3 p-3;

    .link__avatar {
        @apply h-12 w-12 shrink-0;
    }

    .link__content {
        @apply min-w-0 flex-1 space-y-0.5;

        .link__content__label {
            @apply block text-xs font-medium tracking-wide text-slate-500 uppercase;
        }

        .link__content__name {
            @apply truncate text-sm font-semibold text-slate-900;
        }
    }
}
</style>
