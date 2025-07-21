<script lang="ts" setup>
import Logo from '@/components/shared/Logo.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
</script>
<template>
    <main class="auth">
        <div class="auth--section"></div>
        <div class="auth--section relative rounded-2xl bg-white p-8">
            <RouterLink :to="{ name: 'locations' }" class="absolute top-6 right-6">
                <Logo />
            </RouterLink>
            <RouterView />
        </div>
    </main>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.auth {
    @apply mx-auto flex h-full min-h-screen w-full items-stretch gap-3 p-6 2xl:w-7/8;

    .auth--section {
        @apply flex w-full flex-col items-center justify-center gap-4;
    }
}
</style>
