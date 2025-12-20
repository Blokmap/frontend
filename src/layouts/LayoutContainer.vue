<script lang="ts" setup>
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ref } from 'vue';

defineProps<{
    loading?: boolean;
}>();

const isSidebarOpen = ref(false);

const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
};

const closeSidebar = () => {
    isSidebarOpen.value = false;
};
</script>

<template>
    <div class="layout-container">
        <!-- Mobile menu toggle button -->
        <button
            class="mobile-menu-toggle lg:hidden"
            @click="toggleSidebar"
            :aria-label="isSidebarOpen ? 'Sluit menu' : 'Open menu'">
            <FontAwesomeIcon :icon="isSidebarOpen ? faTimes : faBars" />
        </button>

        <!-- Backdrop for mobile -->
        <div v-if="isSidebarOpen" class="sidebar-backdrop lg:hidden" @click="closeSidebar"></div>

        <!-- Sidebar -->
        <aside
            class="layout-container__sidebar"
            :class="{ 'layout-container__sidebar--open': isSidebarOpen }"
            @click="closeSidebar">
            <Transition name="slide-in-left" appear>
                <slot name="sidebar"></slot>
            </Transition>
        </aside>

        <!-- Main content -->
        <main class="layout-container__main">
            <slot name="main"></slot>
        </main>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.layout-container {
    @apply relative mx-auto grid w-full flex-1 grid-cols-1;
    @apply my-4 lg:max-w-[1420px] lg:grid-cols-4 lg:px-0;

    .sidebar-backdrop {
        @apply fixed inset-0 z-50 bg-black/50;
    }

    .layout-container__sidebar {
        @apply fixed inset-y-0 left-0 z-50 w-80 -translate-x-full bg-white py-20 shadow-2xl lg:pr-4 xl:pr-10;
        @apply lg:border-r-2 lg:border-slate-200;
        @apply overflow-y-auto transition-transform duration-300;
        @apply lg:relative lg:col-span-1 lg:w-auto lg:translate-x-0 lg:overflow-y-visible lg:bg-transparent lg:py-0 lg:shadow-none;
    }

    .layout-container__sidebar--open {
        @apply translate-x-0;
    }

    .layout-container__main {
        @apply col-span-3 lg:pl-6 xl:pl-12;
    }
}

.mobile-menu-toggle {
    @apply fixed right-4 bottom-4 z-50 flex h-12 w-12 items-center justify-center;
    @apply bg-primary rounded-full text-lg text-white shadow-xl;
    @apply transition-all hover:opacity-90 active:scale-95;
    @apply lg:!hidden;
}
</style>
