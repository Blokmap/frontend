<script lang="ts" setup>
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

withDefaults(
    defineProps<{
        title?: string;
        message?: string;
    }>(),
    {
        title: 'Niet Gevonden',
        message: 'De pagina of resource die je zoekt kon niet worden gevonden.',
    },
);
</script>

<template>
    <div class="flex flex-col items-center justify-center gap-4 py-12 text-center">
        <FontAwesomeIcon :icon="faExclamationTriangle" class="text-6xl text-orange-900" />
        <div class="space-y-2">
            <h2 class="text-2xl font-bold text-gray-700">{{ title }}</h2>
            <p class="text-gray-500">{{ message }}</p>
        </div>
    </div>
</template>
