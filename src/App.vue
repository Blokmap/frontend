<script lang="ts" setup>
import { useMessages } from './composables/useMessages';
import { setupAxiosInterceptors } from './config/axios';
import Toast from '@/components/Toast.vue';
import ProgressBar from '@/components/features/layout/ProgressBar.vue';
import { onMounted, useTemplateRef } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const messages = useMessages();
const progressRef = useTemplateRef('progress');

setupAxiosInterceptors(router, messages);

onMounted(() => {
    router.beforeEach(() => {
        progressRef.value?.start();
    });

    router.afterEach(() => {
        progressRef.value?.finish();
    });
});
</script>

<template>
    <Toast />
    <ProgressBar ref="progress" />
    <RouterView />
</template>
