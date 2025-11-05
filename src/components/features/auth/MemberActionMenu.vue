<script lang="ts" setup>
import ActionMenu from '@/components/shared/atoms/menu/ActionMenu.vue';
import ActionMenuButton from '@/components/shared/atoms/menu/ActionMenuButton.vue';
import ActionMenuSelect from '@/components/shared/atoms/menu/ActionMenuSelect.vue';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { computed } from 'vue';
import type { Membership, Role } from '@/domain/auth';

const props = withDefaults(
    defineProps<{
        member: Membership;
        availableRoles: Role[];
        isPending?: boolean;
        showRoleSelect?: boolean;
        showDelete?: boolean;
    }>(),
    {
        showRoleSelect: true,
        showDelete: true,
    },
);

const emit = defineEmits<{
    'select:role': [memberId: string, roleId: number];
    'click:delete': [memberId: string];
}>();

const roleOptions = computed(() => {
    return props.availableRoles.map((role: Role) => ({
        label: role.name,
        value: role.id,
    }));
});

/**
 * Handle role selection change.
 *
 * @param roleId - The selected role's ID
 */
function onRoleSelect(roleId: number): void {
    emit('select:role', props.member.profile.id, roleId);
}

/**
 * Handle delete button click.
 */
function onDeleteClick(): void {
    emit('click:delete', props.member.profile.id);
}
</script>

<template>
    <ActionMenu :is-pending="isPending">
        <template #trigger="{ toggle }">
            <slot name="trigger" :toggle="toggle"></slot>
        </template>

        <template #content>
            <ActionMenuSelect
                v-if="showRoleSelect"
                :value="member.role.id"
                :options="roleOptions"
                :loading="isPending"
                label="Rol wijzigen"
                placeholder="Selecteer rol"
                @change="onRoleSelect">
            </ActionMenuSelect>
            <ActionMenuButton
                v-if="showDelete"
                :icon="faTrash"
                label="Verwijderen"
                destructive
                @click="onDeleteClick">
            </ActionMenuButton>
        </template>
    </ActionMenu>
</template>
