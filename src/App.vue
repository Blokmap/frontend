<script lang="ts" setup>
import { setupAxiosInterceptors } from './config/axios';
import Toast from '@/components/Toast.vue';
import ProgressBar from '@/components/features/layout/ProgressBar.vue';
import { useToast } from '@/composables/useToast';
import { onMounted, useTemplateRef } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const toast = useToast();
const progressRef = useTemplateRef('progress');

setupAxiosInterceptors(router, toast);

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
