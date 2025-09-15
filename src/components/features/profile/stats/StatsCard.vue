<script setup lang="ts">
import Card from 'primevue/card';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

withDefaults(
    defineProps<{
        icon: any;
        value: string | number;
        label: string;
        iconColor?: string;
    }>(),
    {
        iconColor: 'text-primary-500',
    },
);
</script>

<template>
    <Card class="text-center">
        <template #content>
            <div class="flex flex-col items-center gap-2">
                <FontAwesomeIcon :icon="icon" :class="[iconColor, 'text-2xl']" />
                <div class="text-2xl font-bold text-gray-900">
                    {{ value }}
                </div>
                <div class="text-sm text-gray-600">
                    {{ label }}
                </div>
            </div>
        </template>
    </Card>
</template>
