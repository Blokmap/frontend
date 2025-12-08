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
            <div class="save-bar__container">
                <div class="save-bar__content">
                    <span class="save-bar__text">Je hebt niet-opgeslagen wijzigingen</span>
                    <div class="save-bar__actions">
                        <button
                            @click="emit('cancel')"
                            :disabled="loading"
                            class="save-bar__cancel">
                            <FontAwesomeIcon :icon="faTimes" />
                            <span class="save-bar__action-text">Annuleren</span>
                        </button>
                        <Button
                            @click="emit('save')"
                            :loading="loading"
                            :disabled="disabled"
                            class="save-bar__save">
                            <FontAwesomeIcon v-if="loading" :icon="faSpinner" spin />
                            <FontAwesomeIcon :icon="faSave" v-else />
                            <span>Opslaan</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.save-bar {
    @apply fixed right-0 bottom-0 left-0 z-50;
    @apply border-t-2 border-slate-700 bg-slate-900 shadow-lg;
    @apply lg:right-8 lg:bottom-8 lg:left-auto lg:max-w-md lg:rounded-lg lg:border-2;
}

.save-bar__container {
    @apply px-4 py-2.5 lg:px-6 lg:py-3;
}

.save-bar__content {
    @apply flex items-center justify-between gap-3;
}

.save-bar__text {
    @apply min-w-0 flex-1 overflow-hidden text-sm font-medium text-ellipsis whitespace-nowrap text-white;
}

.save-bar__actions {
    @apply flex flex-shrink-0 items-center justify-end gap-2;
}

.save-bar__cancel {
    @apply flex items-center gap-2 text-sm text-white transition-colors hover:text-slate-300 disabled:opacity-50;
}

.save-bar__action-text {
    @apply hidden lg:inline;
}

.save-bar__save {
    @apply text-sm;
}
</style>
