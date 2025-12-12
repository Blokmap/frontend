<script lang="ts" setup>
import Toast from '@/components/Toast.vue';
import ProgressBar from '@/components/shared/atoms/ProgressBar.vue';
import { setupAxiosInterceptors } from './config/axiosConfig';
import { setupI18n } from './config/i18nConfig';
import { setupAuthGuard, setupRouterGuards } from './config/router/routerGuards';

setupI18n();
setupAxiosInterceptors();
setupAuthGuard();
setupRouterGuards();
</script>

<template>
    <Toast />
    <ProgressBar />
    <RouterView v-slot="{ Component, route }">
        <Transition name="fade" mode="out-in">
            <component :is="Component" :key="route.matched[0]?.path" />
        </Transition>
    </RouterView>
</template>
