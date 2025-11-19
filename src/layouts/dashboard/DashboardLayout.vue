<script setup lang="ts">
import ProgressSpinner from 'primevue/progressspinner';
import Logo from '@/components/shared/atoms/Logo.vue';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useLocalStorage } from '@vueuse/core';
import { ref } from 'vue';
import { useAuthProfile } from '@/composables/data/useAuth';
import DashboardHeader from './DashboardHeader.vue';
import DashboardSidebar from './sidebar/DashboardSidebar.vue';

const { data: profile } = useAuthProfile();

const isSidebarOpen = ref<boolean>(false);
const isSidebarCollapsed = useLocalStorage('sidebar-collapsed', false);

/**
 * Toggle the visibility of the sidebar
 */
function toggleSidebar(): void {
    isSidebarOpen.value = !isSidebarOpen.value;
}
</script>

<template>
    <div class="dashboard-layout">
        <!-- Mobile Header -->
        <header class="dashboard-layout__mobile-header">
            <RouterLink :to="{ name: 'locations' }">
                <Logo :show-subtitle="false" variant="dark" />
            </RouterLink>
            <button
                class="dashboard-layout__mobile-menu-btn"
                @click="toggleSidebar"
                aria-label="Toggle menu">
                <FontAwesomeIcon :icon="faBars" />
            </button>
        </header>

        <!-- Sidebar Navigation -->
        <nav
            class="dashboard-layout__sidebar"
            :class="{
                'dashboard-layout__sidebar--mobile-hidden': !isSidebarOpen,
                'dashboard-layout__sidebar--collapsed': isSidebarCollapsed,
            }">
            <template v-if="!profile">
                <div class="flex h-full w-full items-center justify-center">
                    <ProgressSpinner />
                </div>
            </template>
            <template v-else>
                <DashboardSidebar
                    v-model:visible="isSidebarOpen"
                    v-model:collapsed="isSidebarCollapsed"
                    :profile="profile">
                </DashboardSidebar>
            </template>
        </nav>

        <!-- Main Content -->
        <div class="dashboard-layout__content">
            <template v-if="!profile">
                <div class="flex h-full w-full items-center justify-center">
                    <ProgressSpinner />
                </div>
            </template>
            <template v-else>
                <header class="dashboard-layout__header">
                    <DashboardHeader />
                </header>

                <main class="dashboard-layout__main" role="main">
                    <RouterView v-slot="{ Component }" :profile="profile">
                        <Transition name="fade" mode="out-in">
                            <component :is="Component" />
                        </Transition>
                    </RouterView>
                </main>
            </template>
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.dashboard-layout {
    @apply relative flex flex-1 flex-col md:flex-row;
    @apply md:py-6 md:pr-6;
}

.dashboard-layout__mobile-header {
    @apply flex items-center justify-between;
    @apply px-3 pt-3;
    @apply md:hidden;
}

.dashboard-layout__mobile-menu-btn {
    @apply flex h-10 w-10 items-center justify-center;
    @apply rounded-md bg-slate-900 text-xl text-white;
    @apply transition-colors hover:bg-slate-800;
}

.dashboard-layout__sidebar {
    @apply flex-shrink-0;
    @apply fixed top-0 left-0 z-50 md:sticky md:top-6;
    @apply min-h-screen w-full md:min-h-[calc(100vh-3rem)] md:w-72;
    @apply transition-all duration-300;
}

.dashboard-layout__sidebar--collapsed {
    @apply md:!w-20;
}

.dashboard-layout__sidebar--mobile-hidden {
    @apply hidden md:block;
}

.dashboard-layout__content {
    @apply flex flex-1 flex-col;
    @apply m-3 overflow-hidden rounded-md bg-slate-50;
    @apply md:m-0;
}

.dashboard-layout__header {
    @apply hidden;
    @apply md:flex md:items-center;
    @apply border-b-1 border-slate-200 bg-transparent;
    @apply p-4;
}

.dashboard-layout__main {
    @apply mx-auto w-full max-w-[1200px] flex-1 px-3 py-4;
    @apply bg-transparent;
    @apply md:px-4 md:py-8;
}
</style>
