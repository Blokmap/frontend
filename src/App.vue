<script lang="ts" setup>
import { useSparkleTrail } from './composables/anim/useSparkleTrail';
import Toast from '@/components/Toast.vue';
import ProgressBar from '@/components/features/layout/ProgressBar.vue';
import { onMounted, useTemplateRef } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const progressRef = useTemplateRef('progress');

useSparkleTrail();

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
