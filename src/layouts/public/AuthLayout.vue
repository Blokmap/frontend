<script lang="ts" setup>
import Logo from '@/components/shared/Logo.vue';
import Carousel from '@/components/shared/image/Carousel.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
</script>
<template>
    <main class="auth">
        <div class="auth--section text-center text-slate-200">
            <h2 class="text-3xl">
                Van <span class="font-bold text-slate-300">campus</span> tot
                <span class="font-bold text-slate-300">zolderkamer</span>
            </h2>
            <h4 class="mt-4 text-xl">Vind de perfecte studieplek in jouw buurt</h4>
            <Carousel class="mt-4 max-w-[600px]">
                <img src="@/assets/img/partners/ugent.png" alt="Universiteit Gent" />
                <img src="@/assets/img/partners/stadgent.png" alt="Stad Gent" />
                <img src="@/assets/img/partners/hogent.png" alt="HoGent" class="!w-15" />
                <img src="@/assets/img/partners/kuleuven.png" alt="KU Leuven" />
            </Carousel>
        </div>
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
    @apply mx-auto flex h-full min-h-screen w-full items-stretch gap-3 p-6;

    img {
        @apply w-full grayscale;
    }

    .auth--section {
        @apply flex w-full flex-col items-center justify-center gap-4;
    }
}
</style>
