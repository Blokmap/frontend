<script setup lang="ts">
import { faArrowLeft, faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useRouter } from 'vue-router';

defineProps<{
    code: string;
    title: string;
    description: string;
}>();

const router = useRouter();

const goHome = () => {
    router.push({ name: 'dashboard' });
};

const goBack = () => {
    router.back();
};
</script>

<template>
    <div class="error-page">
        <Transition name="fade" appear mode="out-in">
            <div class="error-page__content">
                <div class="error-page__code-wrapper">
                    <span class="error-page__code">{{ code }}</span>
                </div>
                <h1 class="error-page__title">{{ title }}</h1>
                <p class="error-page__description">{{ description }}</p>
                <div class="error-page__actions">
                    <button
                        class="error-page__button error-page__button--secondary"
                        @click="goBack">
                        <FontAwesomeIcon :icon="faArrowLeft" />
                        <span>Terug</span>
                    </button>
                    <button class="error-page__button error-page__button--primary" @click="goHome">
                        <FontAwesomeIcon :icon="faHome" />
                        <span>Dashboard</span>
                    </button>
                </div>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.error-page {
    @apply flex min-h-screen w-full items-center justify-center bg-white p-6;
}

.error-page__content {
    @apply flex max-w-md flex-col items-center;
}

.error-page__code-wrapper {
    @apply relative mb-8;
}

.error-page__code {
    @apply text-8xl font-light tracking-tight text-gray-900;
    font-variant-numeric: tabular-nums;
}

.error-page__title {
    @apply mb-3 text-center text-2xl font-medium text-gray-900;
}

.error-page__description {
    @apply mb-8 text-center text-base leading-relaxed text-gray-600;
}

.error-page__actions {
    @apply flex items-center gap-3;
}

.error-page__button {
    @apply flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-all duration-200;
}

.error-page__button--primary {
    @apply bg-gray-900 text-white hover:bg-gray-800;
}

.error-page__button--secondary {
    @apply border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-100;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
