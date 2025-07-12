<script setup lang="ts">
import PublicFooter from './PublicFooter.vue';
import PublicHeader from './PublicHeader.vue';
import { useAuthLogout, useAuthProfile } from '@/composables/services/useAuth';
import { useMessages } from '@/composables/useMessages';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const { showMessage } = useMessages();

const { profile, profileIsLoading } = useAuthProfile();

const { logout, logoutIsLoading } = useAuthLogout({
    onSuccess: () => {
        showMessage({
            severity: 'success',
            summary: 'Logged out',
            detail: 'You have successfully logged out.',
        });
    },
});

const route = useRoute();
const previousRoute = ref(route);

watch(route, (_, oldRoute) => {
    previousRoute.value = oldRoute;
});
</script>

<template>
    <div class="relative flex min-h-screen flex-col pt-[84px]">
        <div class="fixed top-0 right-0 left-0 z-50">
            <PublicHeader
                :profile="profile"
                :profile-is-loading="profileIsLoading"
                :logout-is-loading="logoutIsLoading"
                @logout="logout">
            </PublicHeader>
        </div>
        <main class="mx-auto my-8 flex w-full flex-grow flex-col items-stretch px-8">
            <RouterView />
        </main>
        <PublicFooter />
    </div>
</template>
