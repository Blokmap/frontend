<script lang="ts" setup>
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

withDefaults(
    defineProps<{
        title?: string;
        message?: string;
    }>(),
    {
        title: 'Geen Toegang',
        message: 'Je hebt geen toestemming om deze pagina te bekijken.',
    },
);
</script>

<template>
    <div class="flex h-full w-full flex-col items-center justify-center gap-4 py-12 text-center">
        <FontAwesomeIcon :icon="faLock" class="text-6xl text-red-500" />
        <div class="space-y-2">
            <h2 class="text-2xl font-bold text-gray-900">{{ title }}</h2>
            <p class="text-gray-600">{{ message }}</p>
        </div>
    </div>
</template>
