<script setup lang="ts">
import Button from 'primevue/button';
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
        <Transition name="slide-up" appear>
            <div class="error-page__container">
                <h1 class="error-page__code">{{ code }}</h1>
                <h2 class="error-page__title">{{ title }}</h2>
                <p class="error-page__description">{{ description }}</p>
                <div class="error-page__actions">
                    <Button label="Terug" severity="secondary" @click="goBack">
                        <template #icon>
                            <FontAwesomeIcon :icon="faArrowLeft" />
                        </template>
                    </Button>
                    <Button label="Naar Dashboard" @click="goHome">
                        <template #icon>
                            <FontAwesomeIcon :icon="faHome" />
                        </template>
                    </Button>
                </div>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.error-page {
    @apply flex min-h-screen w-full items-center justify-center bg-slate-900 p-8;
}

.error-page__container {
    @apply w-full max-w-2xl rounded-3xl bg-slate-700 p-12 text-center shadow-md md:p-16;
}

.error-page__code {
    @apply m-0 text-9xl leading-tight font-extrabold text-slate-100;
}

.error-page__title {
    @apply mt-4 mb-2 text-4xl font-semibold text-slate-100;
}

.error-page__description {
    @apply mt-6 mb-10 text-xl leading-relaxed text-slate-300;
}

.error-page__actions {
    @apply flex flex-wrap justify-center gap-4;
}
</style>
