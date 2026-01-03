<script setup lang="ts">
import LocationFilterDialog from '@/components/molecules/location/LocationFilterDialog.vue';
import LocationSearchSpotlight from '@/components/molecules/location/search/LocationSearchSpotlight.vue';
import PublicHeader from '@/components/organisms/layouts/public//PublicHeader.vue';
import PublicFooter from '@/components/organisms/layouts/public/PublicFooter.vue';
import { useMagicKeys } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { watchEffect } from 'vue';
import { useReadTags } from '@/composables/data/useTags';
import { useLayoutState } from '@/composables/store/useLayoutState';

const { space, k, meta, control } = useMagicKeys();
const { showSpotlight, showFilters } = storeToRefs(useLayoutState());

const { data: tags } = useReadTags();

watchEffect(() => {
    const isMetaKey = control.value || meta.value;
    const isToggleKey = space.value || k.value;

    if (isMetaKey && isToggleKey) {
        showSpotlight.value = !showSpotlight.value;
    }
});
</script>

<template>
    <div class="public-layout">
        <header class="public-layout__header">
            <div class="public-layout__container">
                <PublicHeader
                    @click:search="showSpotlight = true"
                    @click:filters="showFilters = true">
                </PublicHeader>
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
            <LocationSearchSpotlight v-model:visible="showSpotlight" />
            <LocationFilterDialog v-model:visible="showFilters" :tags="tags" v-if="tags" />
        </Teleport>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.public-layout {
    @apply m-0 h-screen md:m-6 md:mb-0;
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
    @apply py-3 md:py-6;
    @apply border-b border-slate-200 bg-slate-50 md:rounded-t-md;
}

.public-layout__footer {
    @apply bg-slate-900 text-slate-300;
    @apply py-4 md:py-6;
}
</style>
