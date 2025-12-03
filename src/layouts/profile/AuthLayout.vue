<script lang="ts" setup>
import Logo from '@/components/shared/atoms/Logo.vue';
import AutoCarousel from '@/components/shared/molecules/image/AutoCarousel.vue';
import hogent from '@/assets/img/logos/partners/monochrome/hogent.png';
import kuleuven from '@/assets/img/logos/partners/monochrome/kuleuven.png';
import stadgent from '@/assets/img/logos/partners/monochrome/stadgent.png';
import ugent from '@/assets/img/logos/partners/monochrome/ugent.png';

const logos = [
    {
        src: ugent,
        alt: 'Universiteit Gent',
    },
    {
        src: stadgent,
        alt: 'Stad Gent',
    },
    {
        src: hogent,
        alt: 'HoGent',
    },
    {
        src: kuleuven,
        alt: 'KU Leuven',
    },
];
</script>
<template>
    <main class="auth">
        <div class="auth__section auth__section--callout">
            <h2 class="text-2xl md:text-3xl">
                Van <span class="font-bold text-slate-300">campus</span> tot
                <span class="font-bold text-slate-300">zolderkamer</span>
            </h2>
            <h4 class="text-md md:text-xl">Vind de perfecte studieplek in jouw buurt</h4>
            <AutoCarousel class="max-w-[600px]">
                <img v-for="logo in logos" :key="logo.alt" :src="logo.src" :alt="logo.alt" />
            </AutoCarousel>
        </div>
        <div class="auth__section auth__section--slot">
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
    @apply mx-auto h-full min-h-screen w-full items-stretch;
    @apply gap-8 p-3 lg:p-6;
    @apply flex flex-col-reverse lg:flex-row;

    img {
        @apply w-full grayscale;
    }

    .auth__section {
        @apply flex w-full flex-col items-center justify-center gap-4;

        &.auth__section--callout {
            @apply text-center text-slate-200;
            @apply gap-6 py-8 lg:gap-8;
        }

        &.auth__section--slot {
            @apply relative rounded-2xl bg-white p-8;
            @apply h-[calc(100vh-1.5rem)] lg:h-auto;
        }
    }
}
</style>
