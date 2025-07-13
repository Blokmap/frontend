<script setup lang="ts">
import PublicFooter from './PublicFooter.vue';
import PublicHeader from './PublicHeader.vue';
import { useAuthLogout, useAuthProfile } from '@/composables/services/useAuth';
import { useMessages } from '@/composables/useMessages';

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
</script>

<template>
    <div class="relative flex min-h-screen flex-col pt-[90px]">
        <div class="fixed top-0 right-0 left-0 z-50 mx-6 my-4 2xl:mx-auto 2xl:w-7/8">
            <PublicHeader
                :profile="profile"
                :profile-is-loading="profileIsLoading"
                :logout-is-loading="logoutIsLoading"
                @logout="logout">
            </PublicHeader>
        </div>
        <main class="mx-auto my-4 flex w-full flex-grow flex-col items-stretch px-6 2xl:w-7/8">
            <RouterView />
        </main>
        <PublicFooter />
    </div>
</template>
