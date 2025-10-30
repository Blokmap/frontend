<script lang="ts" setup>
import Select, { type SelectChangeEvent } from 'primevue/select';
import ActionMenu from '@/components/shared/atoms/ActionMenu.vue';
import NavigationLink from '@/components/shared/atoms/NavigationLink.vue';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { computed } from 'vue';
import RoleBadge from './roles/RoleBadge.vue';
import type { Membership, Role } from '@/domain/auth';

const props = defineProps<{
    member: Membership;
    availableRoles: Role[];
    isPending?: boolean;
}>();

const emit = defineEmits<{
    'change:role': [profileId: string, roleName: string];
    remove: [profileId: string];
}>();

const roleOptions = computed(() => {
    return props.availableRoles.map((role) => ({
        label: role.name,
        value: role,
    }));
});

/**
 * Handle changing the member's role.
 *
 * @param event - The select change event.
 * @param hideMenu - Function to hide the action menu.
 */
async function onRoleChange(event: SelectChangeEvent, hideMenu: () => void) {
    const roleName = event.value;

    if (roleName && roleName !== props.member.role.name) {
        hideMenu();
        emit('change:role', props.member.profile.id, roleName);
    }
}

/**
 * Handle removing the member.
 *
 * @param hideMenu - Function to hide the action menu.
 */
function onRemoveMember(hideMenu: () => void) {
    hideMenu();
    emit('remove', props.member.profile.id);
}
</script>

<template>
    <ActionMenu :is-pending="isPending">
        <template #trigger="{ toggle }">
            <slot name="trigger" :toggle="toggle">
                <!-- Default trigger is provided by ActionMenu -->
            </slot>
        </template>

        <template #content="{ hideMenu }">
            <div>
                <label class="mb-1 block text-sm font-medium text-gray-700"> Rol wijzigen </label>
                <Select
                    :model-value="member.role.name"
                    :options="roleOptions"
                    :loading="isPending"
                    option-label="label"
                    option-value="value"
                    placeholder="Selecteer rol"
                    class="w-full min-w-[200px]"
                    @change="(event) => onRoleChange(event, hideMenu)">
                    <template #option="{ option }">
                        <RoleBadge :role="option.value" :clickable="false" />
                    </template>
                    <template #value>
                        <RoleBadge :role="member.role" :clickable="false" />
                    </template>
                </Select>
            </div>
        </template>

        <template #navigation="{ hideMenu }">
            <NavigationLink
                :icon="faTrash"
                label="Verwijderen"
                destructive
                @click="onRemoveMember(hideMenu)">
            </NavigationLink>
        </template>
    </ActionMenu>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
