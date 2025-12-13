<script lang="ts" setup>
import ActionMenu from '@/components/shared/atoms/menu/ActionMenu.vue';
import ActionMenuButton from '@/components/shared/atoms/menu/ActionMenuButton.vue';
import ConfirmDialog from '@/components/shared/molecules/ConfirmDialog.vue';
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ref, watch } from 'vue';
import { DEFAULT_ROLE_NAME, type Role } from '@/domain/member';

const props = defineProps<{
    role: Role;
    pending?: boolean;
}>();

const emit = defineEmits<{
    edit: [role: Role];
    delete: [role: Role];
}>();

const showDeleteDialog = ref(false);

function onEdit() {
    emit('edit', props.role);
}

function onDeleteClick() {
    showDeleteDialog.value = true;
}

function onConfirmDeletion(): void {
    emit('delete', props.role);
}

function onCancelDeletion(): void {
    showDeleteDialog.value = false;
}

watch(
    () => props.pending,
    (isPending, wasPending) => {
        if (wasPending && !isPending && showDeleteDialog.value) {
            showDeleteDialog.value = false;
        }
    },
);
</script>

<template>
    <ActionMenu
        :pending="pending"
        :disabled="role.name === DEFAULT_ROLE_NAME"
        disabled-tooltip="Deze rol kan niet worden aangepast.">
        <template #trigger="{ toggle }">
            <slot name="trigger" :toggle="toggle">
                <!-- Default trigger is provided by ActionMenu -->
            </slot>
        </template>

        <template #navigation>
            <ActionMenuButton :icon="faPencil" label="Bewerken" @click="onEdit" />
            <ActionMenuButton
                :icon="faTrash"
                label="Verwijderen"
                destructive
                @click="onDeleteClick">
            </ActionMenuButton>
        </template>
    </ActionMenu>

    <Teleport to="body">
        <ConfirmDialog
            v-model:visible="showDeleteDialog"
            title="Rol verwijderen"
            confirm-label="Verwijderen"
            :loading="pending"
            @click:confirm="onConfirmDeletion"
            @click:cancel="onCancelDeletion"
            destructive>
            <template #content>
                <p class="text-gray-600">
                    Weet je zeker dat je de rol <strong>"{{ role.name }}"</strong> wilt verwijderen?
                    Deze actie kan niet ongedaan worden gemaakt.
                </p>
                <p class="mt-2 text-gray-600">
                    Let op: Leden met deze rol zullen geen rol meer hebben na het verwijderen.
                </p>
            </template>
        </ConfirmDialog>
    </Teleport>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
