<script setup lang="ts">
import Button from 'primevue/button';
import { faArrowLeft, faMapLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useRouter } from 'vue-router';

defineProps<{
    code: string;
    title: string;
    description: string;
}>();

const router = useRouter();

const goHome = () => {
    router.push({ name: 'locations' });
};

const goBack = () => {
    router.back();
};
</script>

<template>
    <div class="error-page">
        <Transition name="fade-slide-up" appear mode="out-in">
            <div class="error-page__content">
                <div class="error-page__code-wrapper">
                    <span class="error-page__code">{{ code }}</span>
                    <div class="error-page__code-bg"></div>
                </div>
                <h1 class="error-page__title">{{ title }}</h1>
                <p class="error-page__description">{{ description }}</p>
                <div class="error-page__actions">
                    <Button severity="secondary" outlined @click="goBack">
                        <FontAwesomeIcon :icon="faArrowLeft" />
                        <span>Ga terug</span>
                    </Button>
                    <Button @click="goHome">
                        <FontAwesomeIcon :icon="faMapLocationDot" />
                        <span>Bekijk locaties</span>
                    </Button>
                </div>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.error-page {
    @apply flex w-full flex-1 items-center justify-center py-12;
}

.error-page__content {
    @apply flex max-w-lg flex-col items-center text-center;
}

.error-page__code-wrapper {
    @apply relative mb-6;
}

.error-page__code {
    @apply text-primary-600 relative z-10 text-[8rem] leading-none font-bold tracking-tighter;
    font-variant-numeric: tabular-nums;
}

.error-page__code-bg {
    @apply bg-primary-100 absolute top-1/2 left-1/2 -z-0 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50 blur-3xl;
}

.error-page__title {
    @apply mb-3 text-2xl font-semibold text-slate-800;
}

.error-page__description {
    @apply mb-8 text-base leading-relaxed text-slate-500;
}

.error-page__actions {
    @apply flex items-center gap-3;
}
</style>
