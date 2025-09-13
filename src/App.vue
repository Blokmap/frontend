<script lang="ts" setup>
import { setupAxiosInterceptors } from './config/axios';
import Toast from '@/components/Toast.vue';
import ProgressBar from '@/components/features/layout/ProgressBar.vue';
import { useProgress } from '@/composables/store/useProgress';
import { useToast } from '@/composables/store/useToast';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const toast = useToast();
const progressStore = useProgress();

onMounted(() => {
    setupAxiosInterceptors(router, toast);

    router.beforeEach(() => {
        progressStore.start();
    });

    router.afterEach(() => {
        progressStore.finish();
    });
});
</script>

<template>
    <Toast />
    <ProgressBar />
    <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
            <component :is="Component" />
        </Transition>
    </RouterView>
</template>

<style>
@reference '@/assets/styles/main.css';

.fade-enter-active {
    @apply !duration-150;
}

.fade-leave-active {
    @apply !duration-150;
}
</style>
