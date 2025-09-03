<script lang="ts" setup>
import { setupAxiosInterceptors } from './utils/axios';
import Toast from '@/components/Toast.vue';
import ProgressBar from '@/components/features/layout/ProgressBar.vue';
import { useAuthProfile } from '@/composables/data/useAuth';
import { useProgress } from '@/composables/store/useProgress';
import { useToast } from '@/composables/store/useToast';
import type { Profile } from '@/domain/profile';
import { onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const toast = useToast();
const progressStore = useProgress();

const profile = useAuthProfile();

watch(profile.data, (profile: Profile | null | undefined) => {
    if (!route.meta.requiresAuth || profile) return;
    router.push({ name: 'Login' });
});

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
