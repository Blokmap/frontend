<script setup lang="ts">
import Spotlight from '@/components/features/layout/Spotlight.vue';
import PublicHeader from '@/layouts/public//PublicHeader.vue';
import PublicFooter from '@/layouts/public/PublicFooter.vue';
import { ref, onMounted, onUnmounted } from 'vue';

const showSpotlight = ref(false);

function handleOpenSpotlight() {
    showSpotlight.value = true;
}

function handleKeyboardShortcuts(event: KeyboardEvent) {
    const isMetaKey = event.metaKey || event.ctrlKey;
    const isTriggerKey = event.code === 'Space' || event.key.toLowerCase() === 'a';

    if (isMetaKey && isTriggerKey) {
        event.preventDefault();
        showSpotlight.value = !showSpotlight.value;
    }
}

onMounted(() => {
    window.addEventListener('keydown', handleKeyboardShortcuts);
});

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyboardShortcuts);
});
</script>

<template>
    <div class="wrapper">
        <header class="header">
            <div class="content">
                <PublicHeader @click:search="handleOpenSpotlight" />
            </div>
        </header>

        <main class="content main">
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

    <Spotlight v-model:visible="showSpotlight" />
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.wrapper {
    @apply m-3 flex-1 md:m-6;
    @apply flex flex-col;

    .content {
        @apply mx-auto max-w-[1680px] px-3 md:px-6 2xl:w-[80vw];
    }

    .main {
        @apply w-full flex-1 rounded-b-md py-6;
        @apply bg-gray-50;
    }

    .header {
        @apply rounded-t-md bg-white py-6;
        @apply border-b border-slate-200;
    }

    .footer {
        @apply bg-slate-900 pt-3 text-slate-300 md:pt-6;
    }
}
</style>
