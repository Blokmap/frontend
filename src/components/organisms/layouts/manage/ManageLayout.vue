<script lang="ts" setup>
import { useAuthProfile } from '@/composables/data/useAuth';

const { data: authProfile } = useAuthProfile();
</script>

<template>
    <RouterView v-slot="{ Component, route }">
        <component
            v-if="authProfile"
            :is="Component"
            :key="route.matched[1]?.path"
            :auth-profile="authProfile">
        </component>
    </RouterView>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
