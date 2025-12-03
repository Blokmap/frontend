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
    <div class="public-layout">
        <header class="public-layout__header">
            <div class="public-layout__container">
                <PublicHeader @click:search="showSpotlight = true" />
            </div>
        </header>

        <main class="public-layout__main">
            <div class="public-layout__container">
                <RouterView v-slot="{ Component }">
                    <Transition name="fade" mode="out-in">
                        <KeepAlive :include="['LocationsPage']">
                            <component :is="Component" />
                        </KeepAlive>
                    </Transition>
                </RouterView>
            </div>
        </main>

        <footer class="public-layout__footer">
            <div class="public-layout__container">
                <PublicFooter />
            </div>
        </footer>

        <Teleport to="body">
            <LocationSearch v-model:visible="showSpotlight" />
        </Teleport>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.public-layout {
    @apply m-0 h-screen md:m-6;
    @apply flex flex-1 flex-col;
}

.public-layout__container {
    @apply mx-auto w-full max-w-[1420px] 2xl:w-[85vw] 2xl:max-w-[1920px];
    @apply px-3 md:px-6;
}

.public-layout__main {
    @apply flex w-full flex-1 flex-col py-4 md:py-6;
    @apply bg-slate-50 md:rounded-b-md;

    .public-layout__container {
        @apply flex flex-1 flex-col;
    }
}

.public-layout__header {
    @apply py-6;
    @apply border-b-2 border-slate-200 bg-slate-50 md:rounded-t-md;
}

.public-layout__footer {
    @apply bg-slate-900 text-slate-300;
    @apply pt-4 pb-1 md:pt-6;
}
</style>
