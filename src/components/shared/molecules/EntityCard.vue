<script lang="ts" setup>
import Button from 'primevue/button';
import Skeleton from 'primevue/skeleton';
import EntityAvatar from '@/components/shared/molecules/avatar/EntityAvatar.vue';
import EntityAvatarDialog from '@/components/shared/molecules/avatar/EntityAvatarDialog.vue';
import { faPencil, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

defineProps<{
    loading?: boolean;
    editable?: boolean;
    avatarImage?: string;
    avatarIcon?: IconDefinition;
    avatarEditable?: boolean;
    editMode?: boolean;
    saving?: boolean;
    avatarTitle?: string;
    avatarSubtitle?: string;
    avatarUpdating?: boolean;
    avatarDeleting?: boolean;
    avatarDialogVisible?: boolean;
}>();

const emit = defineEmits<{
    'click:edit': [];
    'click:save': [];
    'click:cancel': [];
    'update:avatar': [file: File];
    'delete:avatar': [];
    'update:avatarDialogVisible': [value: boolean];
}>();

function onEditClick() {
    emit('click:edit');
}

function onSaveClick() {
    emit('click:save');
}

function onCancelClick() {
    emit('click:cancel');
}

function onAvatarEditClick() {
    emit('update:avatarDialogVisible', true);
}

function onUpdateAvatar(file: File) {
    emit('update:avatar', file);
}

function onDeleteAvatar() {
    emit('delete:avatar');
}
</script>

<template>
    <div class="entity-card">
        <!-- Edit/Save/Cancel buttons -->
        <div v-if="editable" class="entity-card__actions">
            <template v-if="!editMode">
                <Button
                    severity="secondary"
                    text
                    size="small"
                    @click="onEditClick"
                    :pt="{ root: { class: '!p-2' } }">
                    <FontAwesomeIcon :icon="faPencil" />
                </Button>
            </template>
            <template v-else>
                <Button
                    severity="success"
                    text
                    size="small"
                    :loading="saving"
                    @click="onSaveClick"
                    :pt="{ root: { class: '!p-2' } }">
                    <FontAwesomeIcon :icon="faSave" />
                </Button>
                <Button
                    severity="secondary"
                    text
                    size="small"
                    :disabled="saving"
                    @click="onCancelClick"
                    :pt="{ root: { class: '!p-2' } }">
                    <FontAwesomeIcon :icon="faTimes" />
                </Button>
            </template>
        </div>

        <!-- Avatar section -->
        <div class="entity-card__avatar">
            <Skeleton v-if="loading" shape="circle" class="!h-24 !w-24" />
            <EntityAvatar
                v-else
                class="!h-24 !w-24"
                :image="avatarImage"
                :icon="avatarIcon"
                :editable="avatarEditable"
                @click:edit="onAvatarEditClick">
            </EntityAvatar>
        </div>

        <!-- Content section with slots -->
        <div class="entity-card__content">
            <slot name="content"></slot>
        </div>

        <!-- Stats section (optional) -->
        <div v-if="$slots.stats" class="entity-card__stats">
            <slot name="stats"></slot>
        </div>

        <!-- Additional section (optional) -->
        <div v-if="$slots.additional" class="entity-card__additional">
            <slot name="additional"></slot>
        </div>

        <!-- Avatar dialog -->
        <Teleport to="body">
            <EntityAvatarDialog
                v-if="avatarEditable"
                :title="avatarTitle || 'Avatar'"
                :subtitle="avatarSubtitle || ''"
                :is-updating="avatarUpdating"
                :is-deleting="avatarDeleting"
                :image="avatarImage || undefined"
                :visible="avatarDialogVisible"
                @update:visible="emit('update:avatarDialogVisible', $event)"
                @update="onUpdateAvatar"
                @delete="onDeleteAvatar">
            </EntityAvatarDialog>
        </Teleport>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.entity-card {
    @apply relative grid grid-cols-2 items-start gap-4 p-4 sm:flex sm:flex-row sm:items-center sm:gap-8 sm:p-8;
    @apply justify-items-center sm:justify-items-stretch;
    @apply rounded-xl bg-white shadow-md;

    .entity-card__actions {
        @apply absolute top-4 right-4 flex gap-2;
    }

    .entity-card__avatar {
        @apply col-span-2 flex items-center justify-center sm:col-span-1;
    }

    .entity-card__content {
        @apply col-span-2 flex w-full flex-1 flex-col gap-3 sm:col-span-1;
    }

    .entity-card__stats {
        @apply col-span-2 flex w-full flex-col divide-y divide-slate-200 sm:col-span-1 sm:flex-1;
    }

    .entity-card__additional {
        @apply col-span-2 flex w-full justify-center;
    }
}
</style>
