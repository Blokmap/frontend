<script lang="ts" setup>
import ProfileAvatar from './ProfileAvatar.vue';
import { useDeleteAvatar, useUpdateAvatar } from '@/composables/data/useProfile';
import { useToast } from '@/composables/useToast';
import type { Profile } from '@/types/schema/Profile';
import { faClose, faImagePortrait, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useQueryClient } from '@tanstack/vue-query';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import { ref } from 'vue';

const props = defineProps<{ profile: Profile }>();
const visible = defineModel<boolean>('visible', { default: false });

const messages = useToast();
const client = useQueryClient();

const { mutate: updateAvatar, isPending: isUpdating } = useUpdateAvatar({
    onSuccess: () => {
        client.invalidateQueries({ queryKey: ['profile'] });
        visible.value = false;
        messages.add({
            severity: 'success',
            summary: 'Profielfoto bijgewerkt',
            detail: 'Je profielfoto is succesvol bijgewerkt.',
        });
    },
});

const { mutate: deleteAvatar, isPending: isDeleting } = useDeleteAvatar({
    onSuccess: () => {
        client.invalidateQueries({ queryKey: ['profile'] });
        visible.value = false;
        messages.add({
            severity: 'success',
            summary: 'Profielfoto verwijderd',
            detail: 'Je profielfoto is succesvol verwijderd.',
        });
    },
});

const selectedFile = ref<File | null>(null);
const selectedImage = ref<string>();

function handleUpdateClick(): void {
    if (!selectedFile.value) return;
    updateAvatar({ profileId: props.profile.id, file: selectedFile.value });
}

function handleDeleteClick(): void {
    deleteAvatar(props.profile.id);
}

function onFileChange(e: Event): void {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = () => (selectedImage.value = reader.result?.toString());
        reader.readAsDataURL(file);
        selectedFile.value = file;
    }
}
</script>

<template>
    <Dialog v-model:visible="visible" class="w-[350px]" :draggable="false" modal>
        <template #container>
            <div class="overflow-y-auto p-4">
                <div class="flex items-center justify-between">
                    <h2 class="text-xl font-medium">Profielfoto</h2>
                    <Button severity="contrast" @click="visible = false" outlined rounded>
                        <template #icon>
                            <FontAwesomeIcon :icon="faClose" />
                        </template>
                    </Button>
                </div>

                <p class="mt-3 text-slate-700">
                    Je profielfoto is zichtbaar voor anderen op je reviews en geregistreerde
                    locaties.
                </p>

                <div class="my-9 space-y-4 text-center">
                    <label class="mx-auto block aspect-square w-full max-w-[250px] cursor-pointer">
                        <ProfileAvatar :profile="props.profile" :image="selectedImage" />
                        <input type="file" accept="image/*" class="hidden" @change="onFileChange" />
                    </label>
                    <p class="text-sm text-gray-500">Klik om foto te wijzigen</p>
                </div>

                <div class="flex gap-4">
                    <Button
                        class="flex-1"
                        severity="primary"
                        label="Opslaan"
                        :loading="isUpdating"
                        :disabled="!selectedFile || isUpdating"
                        @click="handleUpdateClick">
                        <template #icon>
                            <FontAwesomeIcon :icon="faImagePortrait" />
                        </template>
                    </Button>
                    <Button
                        class="flex-1"
                        severity="contrast"
                        label="Verwijderen"
                        :loading="isDeleting"
                        :disabled="!props.profile.avatarUrl || isDeleting"
                        @click="handleDeleteClick">
                        <template #icon>
                            <FontAwesomeIcon :icon="faTrash" />
                        </template>
                    </Button>
                </div>
            </div>
        </template>
    </Dialog>
</template>
