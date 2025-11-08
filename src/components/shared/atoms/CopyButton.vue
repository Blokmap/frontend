<script setup lang="ts">
import { faCopy, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ref } from 'vue';

interface Props {
    value: string;
    successDuration?: number;
}

const props = withDefaults(defineProps<Props>(), {
    successDuration: 2000,
});

const copied = ref(false);

const copyToClipboard = async () => {
    try {
        await navigator.clipboard.writeText(props.value);
        copied.value = true;
        setTimeout(() => {
            copied.value = false;
        }, props.successDuration);
    } catch (error) {
        console.error('Failed to copy to clipboard:', error);
    }
};
</script>

<template>
    <button
        type="button"
        class="copy-button"
        :class="{ 'copy-button--copied': copied }"
        @click="copyToClipboard"
        :title="copied ? 'Copied!' : 'Copy to clipboard'">
        <FontAwesomeIcon :icon="copied ? faCheck : faCopy" class="copy-button__icon" />
    </button>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.copy-button {
    @apply inline-flex items-center justify-center;
    @apply h-6 w-6 rounded;
    @apply text-gray-400 hover:text-gray-600;
    @apply transition-colors duration-200;
    @apply cursor-pointer;

    &:hover {
        @apply bg-gray-100;
    }

    &--copied {
        @apply text-green-600;
    }
}

.copy-button__icon {
    @apply text-sm;
}
</style>
