<script setup lang="ts">
import PublicFooter from './PublicFooter.vue';
import PublicHeader from './PublicHeader.vue';
</script>

<template>
    <div class="wrapper">
        <header class="header">
            <div class="content">
                <PublicHeader />
            </div>
        </header>

        <main class="content w-full flex-1">
            <RouterView v-slot="{ Component }">
                <KeepAlive :include="['LocationsPage']">
                    <component :is="Component" />
                </KeepAlive>
            </RouterView>
        </main>

        <footer class="footer">
            <div class="content">
                <PublicFooter />
            </div>
        </footer>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.wrapper {
    @apply m-3 flex-1 md:m-6;
    @apply flex flex-col gap-6;
    @apply rounded-md bg-gray-50;

    .content {
        @apply mx-auto max-w-[1920px] px-3 md:px-6 xl:w-[85vw];
    }

    .header {
        @apply py-6;
        @apply border-b-1 border-slate-200;
    }

    .footer {
        @apply rounded-b-md border-t border-slate-200 bg-white;
    }
}
</style>
