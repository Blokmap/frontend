<script setup lang="ts">
import Message from 'primevue/message';

import {
    type IconDefinition,
    faCheckCircle,
    faExclamationTriangle,
    faInfoCircle,
    faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

withDefaults(
    defineProps<{
        severity?: 'info' | 'warn' | 'error' | 'success';
        message?: string;
        icon?: IconDefinition;
    }>(),
    {
        severity: 'info',
    },
);

const icons = {
    info: faInfoCircle,
    warn: faExclamationTriangle,
    error: faTimesCircle,
    success: faCheckCircle,
};
</script>

<template>
    <Message :severity="severity">
        <template #icon>
            <slot name="icon">
                <FontAwesomeIcon class="text-xl" :icon="icon || icons[severity]" />
            </slot>
        </template>
        <template #default>
            <slot name="default">
                {{ message }}
            </slot>
        </template>
    </Message>
</template>
