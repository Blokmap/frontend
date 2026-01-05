<script lang="ts" setup>
import Button from 'primevue/button';
import Card from 'primevue/card';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

defineProps<{
    title: string;
    icon: IconDefinition;
    isUpdating?: boolean;
}>();

const emit = defineEmits<{
    save: [];
    cancel: [];
}>();

const editMode = defineModel<boolean>('editMode', {
    default: false,
});
</script>

<template>
    <Card>
        <template #title>
            <div class="editable-card__header">
                <div class="editable-card__title">
                    <FontAwesomeIcon :icon="icon" class="text-primary-600"></FontAwesomeIcon>
                    <span class="font-bold">{{ title }}</span>
                </div>
                <Button v-if="!editMode" rounded text size="small" @click="editMode = true">
                    <template #icon>
                        <FontAwesomeIcon :icon="faPencil"></FontAwesomeIcon>
                    </template>
                </Button>
            </div>
        </template>
        <template #content>
            <div class="mt-4 space-y-4">
                <slot></slot>
                <div v-if="editMode" class="card__actions">
                    <slot name="actions">
                        <Button
                            label="Opslaan"
                            size="small"
                            :loading="isUpdating"
                            @click="emit('save')"></Button>
                        <Button
                            label="Annuleer"
                            size="small"
                            severity="contrast"
                            outlined
                            @click="emit('cancel')"></Button>
                    </slot>
                </div>
            </div>
        </template>
    </Card>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.editable-card__header {
    @apply flex items-center justify-between;
}

.editable-card__title {
    @apply flex items-center gap-2;
}

.card__actions {
    @apply flex gap-2;
}
</style>
