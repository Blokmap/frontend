<script lang="ts" setup>
import Button from 'primevue/button';
import FloatingPopover from '@/components/shared/atoms/FloatingPopover.vue';
import { ref } from 'vue';

withDefaults(
    defineProps<{
        message?: string;
        loading?: boolean;
    }>(),
    {
        loading: false,
    },
);

const emit = defineEmits<{
    (e: 'confirm'): [];
    (e: 'cancel'): [];
}>();

const triggerRef = ref<HTMLElement | null>(null);
const isVisible = ref(false);

function togglePopover() {
    isVisible.value = !isVisible.value;
}

function onConfirm() {
    isVisible.value = false;
    emit('confirm');
}

function onCancel() {
    isVisible.value = false;
    emit('cancel');
}
</script>

<template>
    <div>
        <div ref="triggerRef">
            <slot name="trigger" :toggle="togglePopover"></slot>
        </div>

        <FloatingPopover :target-ref="triggerRef" v-model:visible="isVisible">
            <div class="confirm-popover">
                <div class="confirm-popover__message">
                    <slot name="message">{{ message || 'Are you sure?' }}</slot>
                </div>
                <div class="confirm-popover__actions">
                    <slot name="actions" :on-confirm="onConfirm" :on-cancel="onCancel">
                        <Button
                            size="small"
                            severity="secondary"
                            text
                            label="Annuleren"
                            @click="onCancel">
                        </Button>
                        <Button
                            size="small"
                            severity="danger"
                            label="Bevestigen"
                            :loading="loading"
                            @click="onConfirm">
                        </Button>
                    </slot>
                </div>
            </div>
        </FloatingPopover>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.confirm-popover {
    @apply rounded-lg border border-slate-200 bg-white p-3 shadow-lg;
    @apply w-fit max-w-[300px];
}

.confirm-popover__message {
    @apply mb-3 text-sm font-bold text-slate-900;
}

.confirm-popover__actions {
    @apply flex items-center justify-end gap-2;
}
</style>
