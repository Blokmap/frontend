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
    'select:role': [roleName: string];
    'click:delete': [];
}>();

const roleOptions = computed(() => {
    return props.availableRoles.map((role) => ({
        label: role.name,
        value: role.name,
    }));
});

/**
 * Handle role selection change.
 *
 * @param roleName - The selected role name
 */
function onRoleSelect(roleName: string): void {
    emit('select:role', roleName);
}

/**
 * Handle delete button click.
 */
function onDeleteClick(): void {
    emit('click:delete');
}
</script>

<template>
    <ActionMenu :is-pending="isPending">
        <template #trigger="{ toggle }">
            <slot name="trigger" :toggle="toggle" />
        </template>

        <template #content>
            <ActionMenuSelect
                v-if="showRoleSelect"
                :value="member.role.name"
                :options="roleOptions"
                :loading="isPending"
                label="Rol wijzigen"
                placeholder="Selecteer rol"
                @change="onRoleSelect" />
            <ActionMenuButton
                v-if="showDelete"
                :icon="faTrash"
                label="Verwijderen"
                destructive
                @click="onDeleteClick" />
        </template>
    </ActionMenu>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
