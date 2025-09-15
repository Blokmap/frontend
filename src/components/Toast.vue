<script setup lang="ts">
import Button from 'primevue/button';
import Toast from 'primevue/toast';

import {
    type IconDefinition,
    faCheckCircle,
    faExclamationCircle,
    faInfoCircle,
    faTimes,
    faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const severityClasses: Record<string, string> = {
    success: 'text-green-500 bg-green-100 dark:bg-green-800 dark:text-green-200',
    info: 'text-blue-500 bg-blue-100 dark:bg-blue-800 dark:text-blue-200',
    warn: 'text-orange-500 bg-orange-100 dark:bg-orange-700 dark:text-orange-200',
    error: 'text-red-500 bg-red-100 dark:bg-red-800 dark:text-red-200',
};

const severityIcons: Record<string, IconDefinition> = {
    success: faCheckCircle,
    info: faInfoCircle,
    error: faTimesCircle,
    warn: faExclamationCircle,
};
</script>

<template>
    <Toast position="bottom-right">
        <template #container="slotProps">
            <div class="flex items-center gap-3 p-3">
                <div
                    class="inline-flex aspect-square h-10 shrink-0 items-center justify-center rounded-lg"
                    :class="severityClasses[slotProps.message.severity]">
                    <FontAwesomeIcon :icon="severityIcons[slotProps.message.severity]" />
                </div>
                <div class="flex flex-col">
                    <span class="font-semibold">
                        {{ slotProps.message.summary }}
                    </span>
                    <span class="text-sm">
                        {{ slotProps.message.detail }}
                    </span>
                </div>
                <Button class="ms-auto" rounded text @click="slotProps.closeCallback">
                    <template #icon>
                        <FontAwesomeIcon :icon="faTimes" />
                    </template>
                </Button>
            </div>
        </template>
    </Toast>
</template>
