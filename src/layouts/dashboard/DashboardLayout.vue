<script setup lang="ts">
import DashboardHeader from './DashboardHeader.vue';
import DashboardSidebar from './DashboardSidebar.vue';
import { useAuthProfile } from '@/composables/data/useAuth';
import ProgressSpinner from 'primevue/progressspinner';

const { data: profile } = useAuthProfile();
</script>

<template>
    <div class="wrapper">
        <nav class="sidebar" role="navigation" aria-label="Dashboard navigation">
            <template v-if="!profile">
                <div class="flex h-full w-full items-center justify-center">
                    <ProgressSpinner />
                </div>
            </template>
            <template v-else>
                <DashboardSidebar :profile="profile" />
            </template>
        </nav>

        <div class="content">
            <template v-if="!profile">
                <div class="flex h-full w-full items-center justify-center">
                    <ProgressSpinner />
                </div>
            </template>
            <template v-else>
                <header class="header">
                    <DashboardHeader />
                </header>

                <main class="main" role="main">
                    <RouterView />
                </main>
            </template>
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.wrapper {
    @apply flex flex-1;
    @apply py-3 pr-3 md:py-6 md:pr-6;

    .sidebar {
        @apply w-72;
    }

    .content {
        @apply flex flex-1 flex-col overflow-hidden rounded-md bg-gray-50;

        .header {
            @apply border-b-2 border-slate-200 bg-transparent;
            @apply p-4;
            @apply flex items-center;
        }

        .main {
            @apply mx-auto w-full max-w-[1200px] flex-1 space-y-8 px-4 py-8;
            @apply bg-transparent;
        }
    }
}
</style>
