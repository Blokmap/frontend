<script setup lang="ts">
import LocationSearch from '@/components/features/location/search/LocationSearchSpotlight.vue';
import Container from '@/components/shared/atoms/Container.vue';
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
        <Teleport to="body"> <LocationSearch v-model:visible="showSpotlight" /> </Teleport>
        <header class="public-layout__header">
            <Container>
                <PublicHeader @click:search="showSpotlight = true" />
            </Container>
        </header>

        <main class="public-layout__main">
            <Container>
                <RouterView v-slot="{ Component }">
                    <KeepAlive :include="['LocationsPage']">
                        <Transition name="fade" mode="out-in">
                            <component :is="Component" />
                        </Transition>
                    </KeepAlive>
                </RouterView>
            </Container>
        </main>

        <footer class="public-layout__footer">
            <Container>
                <PublicFooter />
            </Container>
        </footer>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.public-layout {
    @apply m-2 md:m-6;
    @apply flex flex-1 flex-col;
}

.public-layout__main {
    @apply w-full flex-1 rounded-b-md;
    @apply py-4 md:py-6;
    @apply bg-slate-50;
}

.public-layout__header {
    @apply rounded-t-md bg-white;
    @apply border-b-2 border-slate-200 py-4 md:py-6;
}

.public-layout__footer {
    @apply bg-slate-900 text-slate-300;
    @apply pt-4 pb-1 md:pt-6;
}
</style>
