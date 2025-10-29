<script lang="ts" setup>
import ActionMenu from '@/components/shared/atoms/ActionMenu.vue';
import NavigationLink from '@/components/shared/atoms/NavigationLink.vue';
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import type { Role } from '@/domain/auth';

const props = defineProps<{
    role: Role;
    isPending?: boolean;
}>();

const emit = defineEmits<{
    edit: [role: Role];
    delete: [role: Role];
}>();

const onEdit = (hideMenu: () => void) => {
    hideMenu();
    emit('edit', props.role);
};

const onDelete = (hideMenu: () => void) => {
    hideMenu();
    emit('delete', props.role);
};
</script>

<template>
    <ActionMenu :is-pending="isPending">
        <template #trigger="{ toggle }">
            <slot name="trigger" :toggle="toggle">
                <!-- Default trigger is provided by ActionMenu -->
            </slot>
        </template>

        <template #navigation="{ hideMenu }">
            <NavigationLink :icon="faPencil" label="Bewerken" @click="onEdit(hideMenu)">
            </NavigationLink>
            <NavigationLink
                :icon="faTrash"
                label="Verwijderen"
                destructive
                @click="onDelete(hideMenu)">
            </NavigationLink>
        </template>
    </ActionMenu>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
