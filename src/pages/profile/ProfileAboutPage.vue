<script setup lang="ts">
import ProfileCard from '@/components/features/profile/ProfileCard.vue';
import { computed } from 'vue';
import { useAuthProfile } from '@/composables/data/useAuth';
import { useReadProfileStats } from '@/composables/data/useProfile';

const { data: profile } = useAuthProfile();
const { data: stats } = useReadProfileStats(computed(() => profile.value?.id ?? null));
</script>

<template>
    <div class="space-y-6">
        <h1 class="text-3xl font-extrabold">Mijn Profiel</h1>
        <ProfileCard class="w-full" :profile="profile" :stats="stats" />
    </div>
</template>
