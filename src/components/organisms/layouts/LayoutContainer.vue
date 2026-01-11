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
    <div class="container">
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
            class="container__sidebar"
            :class="{ 'container__sidebar--open': isSidebarOpen }"
            @click="closeSidebar">
            <Transition name="slide-in-left" appear>
                <slot name="sidebar"></slot>
            </Transition>
        </aside>

        <!-- Main content -->
        <main class="container__main">
            <slot name="main"></slot>
        </main>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.container {
    @apply mx-auto grid grid-cols-1 lg:grid-cols-4;

    .sidebar-backdrop {
        @apply fixed inset-0 z-50 bg-black/50;
    }

    .container__sidebar {
        @apply fixed inset-y-0 left-0 z-50 w-80 -translate-x-full;
        @apply overflow-y-auto bg-white py-20 shadow-2xl transition-transform duration-300;
        @apply lg:relative lg:col-span-1 lg:w-auto lg:translate-x-0 lg:py-0;
        @apply lg:overflow-y-visible lg:bg-transparent lg:shadow-none;
        @apply lg:border-r lg:border-slate-200 lg:pr-4 xl:pr-10;
    }

    .container__sidebar--open {
        @apply translate-x-0;
    }

    .container__main {
        @apply lg:col-span-3 lg:pl-6 xl:pl-12;
    }
}

.mobile-menu-toggle {
    @apply fixed right-4 bottom-4 z-50 flex h-12 w-12 items-center justify-center;
    @apply bg-primary rounded-full text-lg text-white shadow-xl;
    @apply transition-all hover:opacity-90 active:scale-95;
    @apply lg:!hidden;
}
</style>
