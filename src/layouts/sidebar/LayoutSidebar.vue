<script lang="ts" setup>
import Skeleton from 'primevue/skeleton';
import EntityAvatar from '@/components/shared/molecules/avatar/EntityAvatar.vue';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

defineProps<{
    title?: string | null;
    logo?: string | null;
    showBackButton?: boolean;
    loading?: boolean;
}>();

const emit = defineEmits<{
    'click:back': [];
}>();
</script>

<template>
    <aside class="sidebar">
        <button v-if="showBackButton" class="sidebar__back-button" @click="emit('click:back')">
            <FontAwesomeIcon :icon="faChevronLeft" />
            <span>Terug</span>
        </button>
        <slot name="header"> </slot>
        <div v-if="title || loading" class="sidebar__header">
            <div v-if="loading" class="sidebar__title-group">
                <Skeleton class="!h-7 !w-32" />
            </div>
            <div v-else class="sidebar__title-group">
                <EntityAvatar v-if="logo" :image="logo" :alt="title" class="sidebar__logo">
                </EntityAvatar>
                <h1 class="sidebar__title">{{ title }}</h1>
            </div>
        </div>
        <nav class="sidebar__nav">
            <slot name="default"></slot>
        </nav>
    </aside>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.sidebar {
    @apply flex flex-col space-y-6 lg:h-full lg:pr-12;
    @apply lg:border-r-2 lg:border-slate-200;

    .sidebar__back-button {
        @apply flex w-fit items-center gap-2 text-sm text-slate-600 transition-colors hover:text-slate-900;
    }

    .sidebar__header {
        @apply flex items-center gap-2 lg:gap-3;

        .sidebar__title-group {
            @apply flex items-center gap-3;

            .sidebar__logo {
                @apply h-10 w-10 shrink-0 rounded-full;
            }

            .sidebar__title {
                @apply text-xl leading-tight font-extrabold;
            }
        }
    }

    .sidebar__nav {
        @apply flex flex-col space-y-3;
        @apply lg:sticky lg:top-6 lg:max-h-[calc(100vh-180px)] lg:overflow-y-auto;
    }
}
</style>
