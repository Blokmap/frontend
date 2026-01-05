<script setup lang="ts">
import Card from 'primevue/card';
import { type IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

defineProps<{
    icon: IconDefinition;
}>();

defineEmits<{
    'click:close': [];
    'click:save': [];
}>();
</script>

<template>
    <Card class="card">
        <template #header>
            <div class="card__header">
                <div v-if="icon" class="header__icon">
                    <FontAwesomeIcon :icon="icon" />
                </div>
                <div class="header__title">
                    <slot name="header"></slot>
                </div>
                <div class="header__actions">
                    <slot name="actions"> </slot>
                </div>
            </div>
        </template>
        <template #content>
            <div class="card__body">
                <slot name="default"></slot>
            </div>
        </template>
    </Card>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.card {
    .card__header {
        @apply flex flex-wrap items-center gap-3 p-4 pb-0;

        .header__icon {
            @apply bg-primary-50 text-primary-700 hidden h-13 w-13 shrink-0 items-center justify-center sm:flex;
            @apply rounded-full;
        }

        .header__title {
            @apply w-full space-y-1 sm:w-auto sm:flex-1;
        }

        .header__actions {
            @apply mr-auto flex w-full items-center gap-2 sm:ml-auto sm:w-auto;
        }
    }

    .card__body {
        @apply space-y-4;
    }
}
</style>
