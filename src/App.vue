<script lang="ts" setup>
import Toast from '@/components/Toast.vue';
import ProgressBar from '@/components/shared/atoms/ProgressBar.vue';
import { computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthProfile } from '@/composables/data/useAuth';
import { useProgress } from '@/composables/store/useProgress';
import { useToast } from '@/composables/store/useToast';
import { pushRedirectUrl } from '@/domain/auth';
import { setupAxiosInterceptors } from './config/axios';

const router = useRouter();
const route = useRoute();
const progressStore = useProgress();
const toast = useToast();

setupAxiosInterceptors();

const { data: profile } = useAuthProfile({
    enabled: computed(() => {
        const authSettings = route.meta.auth;
        return authSettings?.required !== false;
    }),
});

router.beforeEach(() => {
    progressStore.start();
});

router.afterEach(() => {
    progressStore.finish();
});

// Watch for auth profile changes and redirect if session expires on protected routes
watch(profile, (newProfile, oldProfile) => {
    const authSettings = route.meta.auth;

    // Only act if profile went from being set to null (session expired)
    if (!oldProfile || !!newProfile) {
        return;
    }

    // Only act if current route requires authentication
    if (!authSettings || authSettings.required === false) {
        return;
    }

    toast.add({
        severity: 'warn',
        summary: 'Sessie verlopen',
        detail: 'Je sessie is verlopen. Log opnieuw in om door te gaan.',
    });

    pushRedirectUrl(route.fullPath);

    router.push({ name: 'auth' });
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
