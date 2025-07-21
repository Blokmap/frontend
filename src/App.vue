<script lang="ts" setup>
import Toast from '@/components/Toast.vue';
import ProgressBar from '@/components/features/layout/ProgressBar.vue';
import { onMounted, useTemplateRef } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const progressRef = useTemplateRef('progress');

onMounted(() => {
    router.beforeEach((_, __, next) => {
        progressRef.value?.start();
        next();
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
