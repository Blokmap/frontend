<script lang="ts" setup>
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import { faClose, faImagePortrait, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ref } from 'vue';
import EntityAvatar from './EntityAvatar.vue';

defineProps<{
    image?: string;
    title?: string;
    subtitle?: string;
    isUpdating?: boolean;
    isDeleting?: boolean;
}>();

const visible = defineModel<boolean>('visible', {
    default: false,
});

const emit = defineEmits<{
    delete: [];
    update: [file: File];
}>();

const selectedFile = ref<File | null>(null);
const selectedImage = ref<string>();

function onUpdateClick(): void {
    if (!selectedFile.value) return;
    emit('update', selectedFile.value);
}

function onDeleteClick(): void {
    emit('delete');
}

function onFileChange(e: Event): void {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file) {
        selectedFile.value = file;
        selectedImage.value = URL.createObjectURL(file);
    }
}
</script>

<template>
    <Dialog v-model:visible="visible" class="w-[350px]" :draggable="false" modal>
        <template #container>
            <div class="avatar-dialog">
                <div class="avatar-dialog__header">
                    <slot name="title">
                        <h2 class="avatar-dialog__title">{{ title }}</h2>
                    </slot>
                    <Button severity="contrast" outlined rounded @click="visible = false">
                        <template #icon>
                            <FontAwesomeIcon :icon="faClose" />
                        </template>
                    </Button>
                </div>

                <slot name="subtitle">
                    <p class="avatar-dialog__subtitle">
                        {{ subtitle }}
                    </p>
                </slot>

                <div class="avatar-dialog__preview">
                    <label class="avatar-dialog__upload">
                        <EntityAvatar class="h-full w-full" :image="selectedImage || image" />
                        <input type="file" accept="image/*" class="hidden" @change="onFileChange" />
                    </label>
                    <p class="avatar-dialog__hint">Klik om foto te wijzigen</p>
                </div>

                <div class="avatar-dialog__actions">
                    <Button
                        class="flex-1"
                        severity="primary"
                        label="Opslaan"
                        :loading="isUpdating"
                        :disabled="!selectedFile || isUpdating"
                        @click="onUpdateClick">
                        <template #icon>
                            <FontAwesomeIcon :icon="faImagePortrait" />
                        </template>
                    </Button>
                    <Button
                        class="flex-1"
                        severity="contrast"
                        label="Verwijderen"
                        :loading="isDeleting"
                        :disabled="!image || isDeleting"
                        @click="onDeleteClick">
                        <template #icon>
                            <FontAwesomeIcon :icon="faTrash" />
                        </template>
                    </Button>
                </div>
            </div>
        </template>
    </Dialog>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.avatar-dialog {
    @apply overflow-y-auto p-4;
}

.avatar-dialog__header {
    @apply flex items-center justify-between;
}

.avatar-dialog__title {
    @apply text-xl font-semibold;
}

.avatar-dialog__subtitle {
    @apply mt-2 text-slate-600;
}

.avatar-dialog__preview {
    @apply my-9 space-y-4 text-center;
}

.avatar-dialog__upload {
    @apply mx-auto block aspect-square w-full max-w-[250px] cursor-pointer;
}

.avatar-dialog__hint {
    @apply text-sm text-gray-500;
}

.avatar-dialog__actions {
    @apply flex gap-4;
}
</style>
