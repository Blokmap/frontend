<script lang="ts" setup>
import EntityAvatar from '@/components/shared/molecules/avatar/EntityAvatar.vue';
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
    <RouterLink :to="to" class="block no-underline">
        <div
            class="hover:border-primary-400 hover:bg-primary-50 group flex items-center gap-3 rounded-lg border border-slate-200 p-3 transition-all">
            <EntityAvatar class="h-12 w-12 shrink-0" :image="logo" :icon="icon" circle>
            </EntityAvatar>
            <div class="min-w-0 flex-1">
                <span
                    class="mb-0.5 block text-xs font-medium tracking-wide text-slate-500 uppercase">
                    {{ label }}
                </span>
                <p class="truncate text-sm font-semibold text-slate-900">
                    {{ name }}
                </p>
            </div>
            <FontAwesomeIcon
                :icon="faArrowRight"
                class="group-hover:text-primary-600 text-slate-400 transition-colors">
            </FontAwesomeIcon>
        </div>
    </RouterLink>
</template>
