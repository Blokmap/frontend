<script setup lang="ts">
import DashboardSidebar from './DashboardSidebar.vue';
import { useAuthProfile } from '@/composables/data/useAuth';

const profile = useAuthProfile({
    staleTime: Infinity, // staleness handled by the route guard
});
</script>

<template>
    <div class="m-3 flex min-h-full rounded-lg bg-white md:m-6">
        <main class="mx-auto w-full px-6 2xl:w-7/8">
            <RouterView />
        </main>
    </div>
</template>
