<script lang="ts" setup>
import { useLocalStorage } from '@vueuse/core';
import { computed } from 'vue';
import { useAuthProfile } from '@/composables/data/useAuth';

const { data: profile, isLoading } = useAuthProfile();

const cookieConsent = useLocalStorage<Date | null>('cookieConsent', null);

const show = computed<boolean>(() => {
    return !isLoading.value && !profile.value && !cookieConsent.value;
});

const accept = () => {
    cookieConsent.value = new Date();
};
</script>

<template>
    <Transition name="fade">
        <div v-if="show" class="cookie" @click="accept">
            <div class="cookie__box" @click.stop>
                <img class="cookie__image" src="@/assets/img/illustrations/ah-shit.png" alt="" />
                <div>
                    <h3 class="cookie__title">Yep, wij ook</h3>
                    <p class="cookie__text">
                        Blokmap gebruikt cookies om je ervaring zo goed mogelijk te maken. Ze
                        onthouden wie je bent, wat je leuk vindt, en zorgen ervoor dat alles soepel
                        werkt. Er worden nooit trackingsgegevens opgeslagen.
                    </p>
                    <p class="cookie__link">
                        <RouterLink :to="{ name: 'legal.privacy' }">Privacybeleid</RouterLink>
                    </p>
                    <button class="cookie__button" @click="accept">Ik ga akkoord!</button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.cookie {
    @apply fixed inset-0 z-[9999] flex items-end justify-center bg-black/50 p-4;

    .cookie__box {
        @apply mb-8 flex w-full max-w-3xl flex-col gap-8 rounded-2xl bg-white p-8 shadow-xl sm:mb-0 sm:flex-row;
    }

    .cookie__image {
        @apply aspect-square h-auto w-full rounded-xl object-cover sm:h-38 sm:w-auto sm:self-start;
    }

    .cookie__title {
        @apply mb-3 text-2xl font-bold text-gray-900;
    }

    .cookie__text {
        @apply mb-3 text-gray-700;
    }

    .cookie__link {
        @apply mb-4 text-sm;

        a {
            @apply text-primary hover:text-primary-600 underline;
        }
    }

    .cookie__button {
        @apply bg-primary hover:bg-primary-600 w-full rounded-lg px-6 py-3 font-semibold text-white transition-colors;
    }
}
</style>
