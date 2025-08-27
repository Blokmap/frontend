<script setup lang="ts">
import PublicFooter from './PublicFooter.vue';
import PublicHeader from './PublicHeader.vue';
</script>

<template>
    <div class="wrapper">
        <header class="header">
            <div class="container">
                <PublicHeader />
            </div>
        </header>

        <hr class="divider" />

        <main class="container flex-1">
            <RouterView v-slot="{ Component }">
                <KeepAlive :include="['LocationsPage']">
                    <component :is="Component" />
                </KeepAlive>
            </RouterView>
        </main>

        <footer class="footer">
            <div class="container">
                <PublicFooter />
            </div>
        </footer>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.wrapper {
    @apply m-3 min-h-screen pt-6 md:m-6;
    @apply flex flex-col gap-6;
    @apply rounded-md bg-gray-50;

    .container {
        @apply mx-auto w-full px-3 md:px-6 lg:max-w-[90vw] 2xl:w-7/8;
    }

    .divider {
        @apply border-t-2 border-slate-200;
    }

    .footer {
        @apply rounded-b-md border-t-2 border-slate-200 bg-white;
    }
}
</style>
