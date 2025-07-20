<script setup lang="ts">
import { useAuthProfile } from '@/composables/data/useAuth';

const profile = useAuthProfile({
    // Staleness handled by the route guard.
    staleTime: Infinity,
});
</script>

<template>
    {{ profile.data }}
    <RouterView> </RouterView>
</template>
