<script lang="ts" setup>
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';

withDefaults(
    defineProps<{
        title?: string;
        content?: string;
        confirmLabel?: string;
        cancelLabel?: string;
        destructive?: boolean;
        loading?: boolean;
    }>(),
    {
        title: 'Bevestigen',
        content: 'Weet je dit zeker?',
        confirmLabel: 'Bevestigen',
        cancelLabel: 'Annuleren',
        destructive: false,
        loading: false,
    },
);

const emit = defineEmits<{
    'click:confirm': [];
    'click:cancel': [];
}>();

const visible = defineModel<boolean>('visible', {
    default: false,
});

function onConfirm(): void {
    emit('click:confirm');
}

function onCancel(): void {
    emit('click:cancel');
}
</script>

<template>
    <Dialog
        v-model:visible="visible"
        modal
        :closable="!loading"
        :dismissable-mask="!loading"
        class="mx-4 w-full max-w-lg"
        content-class="rounded-lg">
        <template #header>
            <slot name="title">
                <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
            </slot>
        </template>

        <div class="space-y-4">
            <slot name="content">
                <p class="text-gray-600">{{ content }}</p>
            </slot>
        </div>

        <template #footer>
            <div class="flex justify-end gap-3">
                <Button
                    :label="cancelLabel"
                    severity="contrast"
                    :disabled="loading"
                    @click="onCancel"
                    outlined>
                </Button>
                <Button
                    :label="confirmLabel"
                    :severity="destructive ? 'danger' : 'primary'"
                    :loading="loading"
                    @click="onConfirm">
                </Button>
            </div>
        </template>
    </Dialog>
</template>
