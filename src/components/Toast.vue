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
import { storeToRefs } from 'pinia';
import { useToast as usePrimeToast } from 'primevue';
import { onMounted, watch } from 'vue';
import { useToast } from '@/composables/store/useToast';

const toast = useToast();
const primeToast = usePrimeToast();

const { messages } = storeToRefs(toast);

watch(
    messages,
    () => {
        toast.processQueuedMessages(primeToast);
    },
    { deep: true },
);

onMounted(() => {
    toast.processQueuedMessages(primeToast);
});

const severityClasses: Record<string, string> = {
    success: 'text-primary-500 bg-primary-100',
    info: 'text-primary-500 bg-primary-100',
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
                <div class="icon-container" :class="severityClasses[slotProps.message.severity]">
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

<style scoped>
@reference '@/assets/styles/main.css';

.icon-container {
    @apply inline-flex aspect-square h-10 shrink-0 items-center justify-center rounded-lg;
}
</style>
