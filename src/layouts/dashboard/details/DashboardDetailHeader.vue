<script setup lang="ts">
import Card from 'primevue/card';

defineProps<{
    title?: string;
    primary?: string;
    secondary?: string;
    avatarShape?: 'square' | 'circle';
}>();
</script>

<template>
    <Card class="detail-header-card">
        <template #content>
            <div class="detail-header">
                <!-- Avatar/Logo Section -->
                <div class="avatar-wrapper" v-if="$slots.avatar">
                    <slot name="avatar"></slot>
                </div>

                <!-- Info Section -->
                <div class="detail-info">
                    <!-- Name/Title -->
                    <div v-if="$slots.title || title" class="detail-info__name">
                        <h1 class="text-2xl font-bold text-gray-900">
                            <slot name="title">{{ title }}</slot>
                        </h1>
                    </div>

                    <!-- Primary Info -->
                    <div
                        v-if="$slots.primary || primary"
                        class="flex items-center gap-2 text-gray-600 md:gap-3">
                        <span class="text-sm text-gray-700 md:text-base">
                            <slot name="primary">{{ primary }}</slot>
                        </span>
                    </div>

                    <!-- Secondary Info -->
                    <div
                        v-if="$slots.secondary || secondary"
                        class="flex items-center gap-2 text-gray-600 md:gap-3">
                        <span class="text-sm text-gray-500 md:text-base">
                            <slot name="secondary">{{ secondary }}</slot>
                        </span>
                    </div>
                </div>

                <!-- Actions Section -->
                <div v-if="$slots.actions" class="detail-actions">
                    <slot name="actions"></slot>
                </div>
            </div>
        </template>
    </Card>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.detail-header {
    @apply flex flex-row items-center gap-3 md:gap-6;

    .avatar-wrapper {
        @apply h-16 w-16 flex-shrink-0;
        @apply md:h-24 md:w-24;
    }

    .detail-info {
        @apply flex flex-1 flex-col space-y-1;

        .detail-info__name {
            @apply flex flex-row items-center gap-0.5;
            @apply md:gap-3;

            h1 {
                @apply text-base leading-tight font-bold;
                @apply md:text-2xl md:leading-normal;
            }
        }
    }

    .detail-actions {
        @apply ml-auto flex-shrink-0;
    }
}
</style>
