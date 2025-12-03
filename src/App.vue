<script lang="ts" setup>
import Toast from '@/components/Toast.vue';
import ProgressBar from '@/components/shared/atoms/ProgressBar.vue';
import { useRouter } from 'vue-router';
import { useProgress } from '@/composables/store/useProgress';
import { setupAxiosInterceptors } from './config/axiosConfig';
import { setupI18n } from './config/i18nConfig';
import { setupAuthGuard } from './config/router/routerGuards';

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
    <RouterView v-slot="{ Component, route }">
        <Transition name="fade" mode="out-in">
            <component :is="Component" :key="route.matched[0]?.path" />
        </Transition>
    </RouterView>
</template>
