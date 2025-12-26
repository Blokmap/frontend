<script lang="ts" setup>
import Button from 'primevue/button';
import Logo from '@/components/atoms/Logo.vue';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useAuthProfile } from '@/composables/data/useAuth';

const { data: profile } = useAuthProfile();
</script>

<template>
    <div class="wrapper">
        <nav class="header">
            <div class="container">
                <div class="flex items-center gap-3">
                    <Logo />
                    <div class="ml-auto flex items-center gap-3">
                        <Button text rounded> Beheermodus </Button>
                        <EntityAvatar class="h-11 w-11" v-if="profile" :profile="profile" />
                        <Button text rounded>
                            <template #icon><FontAwesomeIcon :icon="faBars" /></template>
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
        <main class="main">
            <div class="container">Hellaur?</div>
        </main>
        <footer class="footer">
            <div class="container">
                <p class="text-sm text-gray-500">
                    &copy; {{ new Date().getFullYear() }} Blokmap. Alle rechten voorbehouden.
                </p>
            </div>
        </footer>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.wrapper {
    @apply m-2 overflow-hidden rounded-lg bg-white md:m-6;
}

.container {
    @apply mx-auto w-full max-w-[1420px] 2xl:w-[85vw] 2xl:max-w-[1920px];
}

.header {
    @apply border-b border-slate-200 p-6;
}

.main {
    @apply py-6;
}

.footer {
    @apply border-t border-slate-200 p-6;
}
</style>
