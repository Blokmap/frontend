<script setup lang="ts">
import ProgressSpinner from 'primevue/progressspinner';
import Logo from '@/components/shared/atoms/Logo.vue';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ref } from 'vue';
import { useAuthProfile } from '@/composables/data/useAuth';
import DashboardHeader from './DashboardHeader.vue';
import DashboardSidebar from './DashboardSidebar.vue';

const { data: profile } = useAuthProfile();

const isSidebarOpen = ref<boolean>(false);

/**
 * Toggle the visibility of the sidebar
 */
function toggleSidebar(): void {
    isSidebarOpen.value = !isSidebarOpen.value;
}
</script>

<template>
    <div class="wrapper">
        <!-- Mobile Header -->
        <header class="mobile-header">
            <RouterLink :to="{ name: 'locations' }">
                <Logo :show-subtitle="false" variant="dark" />
            </RouterLink>
            <button class="mobile-menu-btn" @click="toggleSidebar" aria-label="Toggle menu">
                <FontAwesomeIcon :icon="faBars" />
            </button>
        </header>

        <!-- Sidebar Navigation -->
        <nav class="sidebar" :class="{ 'mobile-hidden': !isSidebarOpen }">
            <template v-if="!profile">
                <div class="flex h-full w-full items-center justify-center">
                    <ProgressSpinner />
                </div>
            </template>
            <template v-else>
                <DashboardSidebar v-model:visible="isSidebarOpen" :profile="profile" />
            </template>
        </nav>

        <!-- Main Content -->
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
                    <RouterView :profile="profile" />
                </main>
            </template>
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.wrapper {
    @apply relative flex flex-1 flex-col md:flex-row;
    @apply md:py-6 md:pr-6;

    .mobile-header {
        @apply flex items-center justify-between;
        @apply px-3 pt-3;
        @apply md:hidden;

        .mobile-menu-btn {
            @apply flex h-10 w-10 items-center justify-center;
            @apply rounded-md bg-slate-900 text-xl text-white;
            @apply transition-colors hover:bg-slate-800;
        }
    }

    .sidebar {
        @apply flex-shrink-0;
        @apply fixed top-0 left-0 z-50 md:sticky md:top-0;
        @apply h-screen w-full md:w-72;

        &.mobile-hidden {
            @apply hidden md:block;
        }

        .sidebar-close-btn {
            @apply absolute top-3 right-3 z-50;
            @apply flex h-10 w-10 items-center justify-center;
            @apply rounded-md bg-slate-800 text-xl text-white;
            @apply transition-colors hover:bg-slate-700;
            @apply md:hidden;
        }
    }

    .content {
        @apply flex flex-1 flex-col;
        @apply m-3 overflow-hidden rounded-md bg-gray-50;
        @apply md:m-0;

        .header {
            @apply hidden;
            @apply md:flex md:items-center;
            @apply border-b-1 border-slate-200 bg-transparent;
            @apply p-4;
        }

        .main {
            @apply mx-auto w-full max-w-[1200px] flex-1 px-3 py-4;
            @apply bg-transparent;
            @apply md:px-4 md:py-8;
        }
    }
}
</style>
