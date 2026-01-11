<script lang="ts" setup>
import EntityAvatar from '@/components/molecules/avatar/EntityAvatar.vue';
import type { Profile } from '@/domain/profile';

defineProps<{
    profile: Profile;
}>();
</script>

<template>
    <div class="flex items-center space-x-3">
        <EntityAvatar class="h-12 w-12 flex-shrink-0" :image="profile.avatar?.url" circle />
        <div class="min-w-0 flex-1">
            <div class="truncate text-sm font-medium text-slate-900">
                {{ profile.firstName }} {{ profile.lastName }}
            </div>
            <div class="truncate text-xs text-slate-500">@{{ profile.username }}</div>
        </div>
    </div>
</template>
