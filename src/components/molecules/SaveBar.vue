<script lang="ts" setup>
import Button from 'primevue/button';
import { faSave, faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

defineProps<{
    show: boolean;
    loading?: boolean;
    disabled?: boolean;
}>();

const emit = defineEmits<{
    save: [];
    cancel: [];
}>();
</script>

<template>
    <Transition name="slide-up">
        <div v-if="show" class="save-bar">
            <span class="save-bar__text">Je hebt niet-opgeslagen wijzigingen</span>
            <div class="save-bar__actions">
                <button @click="emit('cancel')" :disabled="loading" class="save-bar__cancel">
                    <FontAwesomeIcon :icon="faTimes" />
                    <span class="save-bar__action-text">Annuleren</span>
                </button>
                <Button @click="emit('save')" :loading="loading" :disabled="disabled">
                    <FontAwesomeIcon v-if="loading" :icon="faSpinner" spin />
                    <FontAwesomeIcon :icon="faSave" v-else />
                    <span>Opslaan</span>
                </Button>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.save-bar {
    @apply fixed right-4 bottom-4 left-4 z-50;
    @apply md:left-auto md:max-w-xl;
    @apply flex items-center justify-between gap-4;
    @apply px-5 py-4;
    @apply bg-primary-700 border-primary-800 rounded-lg border-2 shadow-lg;
}

.save-bar__text {
    @apply font-medium text-white;
    @apply text-base md:text-sm;
}

.save-bar__actions {
    @apply flex flex-shrink-0 items-center gap-2;
}

.save-bar__cancel {
    @apply flex items-center gap-2 text-white transition-colors hover:text-slate-300 disabled:opacity-50;
}

.save-bar__action-text {
    @apply hidden md:inline;
}
</style>
