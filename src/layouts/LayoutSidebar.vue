<script lang="ts" setup>
import Button from 'primevue/button';
import Skeleton from 'primevue/skeleton';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

defineProps<{
    title?: string | null;
    subtitle?: string;
    showBackButton?: boolean;
    loading?: boolean;
}>();

const emit = defineEmits<{
    'click:back': [];
}>();
</script>

<template>
    <aside class="sidebar">
        <div v-if="$slots['banner-image']" class="sidebar__banner-wrapper">
            <div class="sidebar__banner">
                <div class="sidebar__banner-image">
                    <Skeleton v-if="loading" class="!h-full !w-full !rounded-none" />
                    <slot v-else name="banner-image"></slot>
                </div>

                <div class="sidebar__banner-badge">
                    <slot name="banner-badge"></slot>
                </div>
            </div>
        </div>
        <slot name="title" v-if="$slots.title">
            <!-- Custom title slot -->
        </slot>
        <div v-else-if="title || loading" class="sidebar__header">
            <Button
                v-if="showBackButton"
                severity="contrast"
                text
                rounded
                size="small"
                @click="emit('click:back')">
                <template #icon>
                    <FontAwesomeIcon :icon="faChevronLeft" />
                </template>
            </Button>
            <div v-if="loading" class="sidebar__title-group">
                <Skeleton class="!h-7 !w-32" />
                <Skeleton v-if="subtitle !== undefined" class="!h-4 !w-24" />
            </div>
            <div v-else class="sidebar__title-group">
                <h1 class="sidebar__title">{{ title }}</h1>
                <span v-if="subtitle" class="sidebar__subtitle">{{ subtitle }}</span>
            </div>
        </div>
        <slot name="content" v-if="$slots.content"></slot>
        <nav class="sidebar__nav">
            <slot name="default"></slot>
        </nav>
    </aside>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.sidebar {
    @apply flex flex-col gap-4 pb-4 lg:h-full lg:border-r-2 lg:border-slate-200 lg:pr-12 lg:pb-0;

    .sidebar__banner-wrapper {
        @apply -mx-4 -mt-4 lg:-mx-0 lg:-mt-0;
    }

    .sidebar__banner {
        @apply relative h-24 w-full overflow-hidden lg:h-32 lg:rounded-xl;
    }

    .sidebar__banner-image {
        @apply h-full w-full;
    }

    .sidebar__banner-image :deep(img) {
        @apply h-full w-full object-cover object-center;
    }

    .sidebar__banner-badge {
        @apply absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2;
    }

    .sidebar__header {
        @apply my-3 flex items-center gap-2 lg:gap-3;
    }

    .sidebar__title-group {
        @apply flex flex-col;
    }

    .sidebar__title {
        @apply text-2xl leading-tight font-extrabold;
    }

    .sidebar__subtitle {
        @apply text-sm text-slate-500 lg:text-sm;
    }

    .sidebar__nav {
        @apply flex flex-col space-y-3;
        @apply lg:sticky lg:top-6 lg:max-h-[calc(100vh-180px)] lg:overflow-y-auto;
    }
}
</style>
