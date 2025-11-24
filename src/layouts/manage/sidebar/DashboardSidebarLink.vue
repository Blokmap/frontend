<script setup lang="ts">
import { faArrowRight, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import type { RouteLocationRaw } from 'vue-router';

const props = defineProps<{
    icon: IconDefinition;
    label: string;
    to: RouteLocationRaw;
    count?: string | null;
    pendingCount?: number;
    testId?: string;
    collapsed?: boolean;
}>();

const emit = defineEmits<{
    navigated: [];
}>();

const router = useRouter();

const isNavigating = ref<boolean>(false);

async function handleClick() {
    isNavigating.value = true;

    await router.push(props.to);
    emit('navigated');

    isNavigating.value = false;
}
</script>

<template>
    <a
        class="sidebar-link"
        :class="{ collapsed }"
        @click.prevent="handleClick"
        :data-testid="testId">
        <FontAwesomeIcon
            :icon="isNavigating ? faSpinner : icon"
            :class="{ 'fa-spin': isNavigating }" />
        <p>{{ label }}</p>
        <span v-if="count" class="count">
            <!--
            No spaces between brackets and content to avoid unwanted whitespace.
            Format: (count) or (count+pending)
            -->
            ({{ count
            }}<span v-if="pendingCount && pendingCount > 0" class="pending"
                ><b>+</b>{{ pendingCount }}</span
            >)
        </span>
        <FontAwesomeIcon class="arrow-icon" :icon="faArrowRight" />
    </a>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.sidebar-link {
    @apply flex w-full items-center space-x-3;
    @apply cursor-pointer transition-colors duration-200 hover:text-slate-300;
    @apply border-l-2 border-transparent py-1;

    &:hover .arrow-icon {
        @apply translate-x-0 opacity-100;
    }

    &.active {
        @apply text-primary-300 border-l-primary-300 pl-2;

        .arrow-icon {
            @apply translate-x-0 opacity-100;
        }
    }

    &.router-link-active {
        @apply text-primary-300;
    }

    > *:first-child {
        @apply flex-shrink-0;
        width: 1rem;
        text-align: center;
    }

    p {
        @apply flex-1 text-sm font-medium;
        @apply transition-all duration-300;
        @apply whitespace-nowrap;
    }

    .count {
        @apply text-xs font-medium text-slate-400;
        @apply transition-all duration-300;

        .pending {
            @apply text-primary-400;
        }
    }

    .arrow-icon {
        @apply translate-x-2 opacity-0 transition-all duration-200;
    }

    &.collapsed {
        @apply md:justify-center md:gap-0 md:space-x-0 md:py-2;

        p,
        .count,
        .arrow-icon {
            @apply md:hidden;
        }

        > *:first-child {
            @apply md:text-lg;
        }
    }
}
</style>
