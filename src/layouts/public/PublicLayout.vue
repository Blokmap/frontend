<script setup lang="ts">
import LocationSearch from '@/components/features/location/search/LocationSearchSpotlight.vue';
import PublicHeader from '@/layouts/public//PublicHeader.vue';
import PublicFooter from '@/layouts/public/PublicFooter.vue';
import { onMounted, onUnmounted, ref } from 'vue';

const showSpotlight = ref(false);

function handleOpenSpotlight() {
    showSpotlight.value = true;
}

function handleKeyboardShortcuts(event: KeyboardEvent) {
    const isMetaKey = event.metaKey || event.ctrlKey;
    const isTriggerKey = event.code === 'Space';

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
                <PublicHeader @click:search="handleOpenSpotlight" />
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
    @apply m-3 md:m-6;
    @apply flex flex-1 flex-col;

    .content {
        @apply mx-auto max-w-[1420px] px-3 md:px-6 2xl:w-[78vw];
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
