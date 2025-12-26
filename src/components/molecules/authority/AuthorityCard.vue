<script lang="ts" setup>
import EntityCard from '@/components/molecules/EntityCard.vue';
import { faBuilding } from '@fortawesome/free-solid-svg-icons';
import type { Authority } from '@/domain/authority';

defineProps<{
    authority: Authority;
    avatarEditable?: boolean;
    updating?: boolean;
    deleting?: boolean;
}>();

const avatarDialogVisible = defineModel<boolean>('avatarDialogVisible', {
    required: false,
    default: false,
});

const emit = defineEmits<{
    'update:avatar': [file: File];
    'delete:avatar': [];
}>();

function onUpdateAvatar(file: File) {
    emit('update:avatar', file);
}

function onDeleteAvatar() {
    emit('delete:avatar');
}
</script>

<template>
    <EntityCard
        :image="authority.logo?.url"
        :icon="faBuilding"
        :avatar-editable="avatarEditable"
        :updating="updating"
        :deleting="deleting"
        v-model:avatar-dialog-visible="avatarDialogVisible"
        @update:avatar="onUpdateAvatar"
        @delete:avatar="onDeleteAvatar">
        <template #avatar-dialog-title>
            <slot name="avatar-dialog-title">
                <h2 class="avatar-dialog__title">Logo</h2>
            </slot>
        </template>
        <template #avatar-dialog-subtitle>
            <slot name="avatar-dialog-subtitle">
                <p class="avatar-dialog__subtitle">Upload het logo van deze groep</p>
            </slot>
        </template>
        <template #content>
            <slot name="content">
                <h2 class="text-2xl font-bold">{{ authority.name }}</h2>
                <p class="text-sm text-gray-500">{{ authority.description }}</p>
            </slot>
        </template>
        <template v-if="$slots.stats" #stats>
            <slot name="stats"></slot>
        </template>
        <template v-if="$slots.additional" #additional>
            <slot name="additional"></slot>
        </template>
    </EntityCard>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.avatar-dialog__title {
    @apply text-xl font-semibold;
}

.avatar-dialog__subtitle {
    @apply mt-2 text-slate-600;
}
</style>
