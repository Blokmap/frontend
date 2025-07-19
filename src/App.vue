<script lang="ts" setup>
import ProgressBar from './components/features/layout/ProgressBar.vue';
import Toast from '@/components/shared/Toast.vue';
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
    <main>
        <Toast />
        <ProgressBar ref="progress" />
        <RouterView />
    </main>
</template>
