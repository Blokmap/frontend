<script setup lang="ts">
import LocationSearch from '@/components/features/location/search/LocationSearchSpotlight.vue';
import PublicHeader from '@/layouts/public//PublicHeader.vue';
import PublicFooter from '@/layouts/public/PublicFooter.vue';
import { onMounted, onUnmounted, ref } from 'vue';

const showSpotlight = ref(false);

/**
 * Handle keyboard shortcuts to open/close the spotlight search.
 *
 * @param event - The keyboard event.
 */
function handleKeyboardShortcuts(event: KeyboardEvent) {
    const isMetaKey = event.metaKey || event.ctrlKey;
    const isTriggerKey = event.code === 'Space' || event.code === 'KeyK';

    if (isMetaKey && isTriggerKey) {
        event.preventDefault();
        showSpotlight.value = !showSpotlight.value;
    }
}

onMounted(() => {
    document.addEventListener('keydown', handleKeyboardShortcuts);
});

onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyboardShortcuts);
});
</script>

<template>
    <div class="wrapper">
        <Teleport to="body"> <LocationSearch v-model:visible="showSpotlight" /> </Teleport>
        <header class="header">
            <div class="content">
                <PublicHeader @click:search="showSpotlight = true" />
            </div>
        </header>

        <main class="main">
            <div class="content">
                <RouterView v-slot="{ Component }">
                    <KeepAlive :include="['LocationsPage']">
                        <component :is="Component" />
                    </KeepAlive>
                </RouterView>
            </div>
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
    @apply w-full;
    @apply m-2 md:m-6;
    @apply flex flex-1 flex-col;

    .content {
        @apply mx-auto max-w-[1420px] 2xl:w-[78vw];
        @apply px-3 md:px-6;
    }

    .main {
        @apply w-full flex-1 rounded-b-md;
        @apply py-4 md:py-6;
        @apply bg-gray-50;
    }

    .header {
        @apply rounded-t-md bg-white;
        @apply py-4 md:py-6;
        @apply border-b border-slate-200;
    }

    .footer {
        @apply bg-slate-900 text-slate-300;
        @apply pt-4 pb-1 md:pt-6;
    }
}
</style>
