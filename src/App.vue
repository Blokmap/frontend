<script lang="ts" setup>
import { setupAxiosInterceptors } from './utils/axios';
import Toast from '@/components/Toast.vue';
import ProgressBar from '@/components/features/layout/ProgressBar.vue';
import { useProgress } from '@/composables/store/useProgress';
import { useToast } from '@/composables/useToast';
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
    <RouterView />
</template>
