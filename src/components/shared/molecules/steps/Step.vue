<script lang="ts" setup>
import { faCheck, faCircleNotch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';

const props = withDefaults(
    defineProps<{
        title?: string;
        status?: 'loading' | 'completed' | 'error' | 'idle';
    }>(),
    {
        status: 'idle',
    },
);

const loading = computed(() => props.status === 'loading');
const completed = computed(() => props.status === 'completed');
const error = computed(() => props.status === 'error');
</script>

<template>
    <div class="group/step flex flex-col">
        <!-- Icon and Title -->
        <div class="flex items-center gap-3">
            <div :class="['icon-container', { loading, completed, error }]">
                <slot name="icon">
                    <FontAwesomeIcon :icon="faCheck" v-if="completed" />
                    <FontAwesomeIcon :icon="faTimes" v-else-if="error" />
                    <FontAwesomeIcon :icon="faCircleNotch" v-else-if="loading" spin />
                </slot>
            </div>
            <slot name="title">
                <h2 class="title">{{ title }}</h2>
            </slot>
        </div>
        <!-- Separator and Content -->
        <div class="flex gap-3">
            <div class="separator-container group-last/step:invisible">
                <div class="separator"></div>
            </div>
            <div class="content">
                <slot name="default"></slot>
            </div>
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.icon-container {
    @apply flex h-8 w-8 items-center justify-center;
    @apply rounded-full;

    &.loading {
        @apply bg-secondary-100 text-secondary-700;
    }

    &.completed {
        @apply bg-primary-100 text-primary-700;
    }

    &.error {
        @apply bg-red-100 text-red-700;
    }
}

.separator-container {
    @apply flex min-w-8 flex-col items-center self-stretch;

    .separator {
        @apply h-full w-[2px] bg-slate-100;
    }
}

.title {
    @apply py-1 font-semibold;
}

.content {
    @apply pt-1 pb-2 text-sm text-slate-700;
}
</style>
