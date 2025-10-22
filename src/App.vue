<script lang="ts" setup>
import Toast from '@/components/Toast.vue';
import ProgressBar from '@/components/shared/atoms/ProgressBar.vue';
import { useRouter } from 'vue-router';
import { useProgress } from '@/composables/store/useProgress';
import { setupAxiosInterceptors } from './config/axios';
import { setupI18n } from './config/i18n';
import { setupAuthGuard } from './config/router/guards';

const router = useRouter();
const progressStore = useProgress();

setupI18n();
setupAxiosInterceptors();
setupAuthGuard();

router.beforeEach(() => {
    progressStore.start();
});

router.afterEach(() => {
    progressStore.finish();
});
</script>

<template>
    <Toast />
    <ProgressBar />
    <RouterView v-slot="{ Component }">
        <component :is="Component" />
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
