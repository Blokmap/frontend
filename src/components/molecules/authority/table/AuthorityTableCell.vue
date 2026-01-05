<script lang="ts" setup>
import EntityAvatar from '@/components/molecules/avatar/EntityAvatar.vue';
import { faBuilding } from '@fortawesome/free-solid-svg-icons';
import type { Authority } from '@/domain/authority';

defineProps<{
    authority: Authority;
}>();
</script>

<template>
    <div class="flex items-center space-x-3">
        <EntityAvatar
            class="h-12 w-12 flex-shrink-0"
            :image="authority.logo?.url"
            :icon="faBuilding"
            :circle="false">
        </EntityAvatar>
        <div class="min-w-0 flex-1">
            <div class="truncate text-sm font-medium text-slate-900">
                {{ authority.name }}
            </div>
            <div class="truncate text-xs text-slate-500">
                {{ authority.description || 'Geen beschrijving' }}
            </div>
        </div>
    </div>
</template>
