<script lang="ts" setup>
import ActionMenu from '@/components/atoms/menu/ActionMenu.vue';
import ActionMenuButton from '@/components/atoms/menu/ActionMenuButton.vue';
import { faUsers, faMapLocationDot, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import type { Authority } from '@/domain/authority';

type AuthorityAction = 'members' | 'locations' | 'edit' | 'delete';

const props = withDefaults(
    defineProps<{
        authority: Authority;
        pending?: boolean;
        actions?: AuthorityAction[];
    }>(),
    {
        actions: () => {
            return ['members', 'locations', 'edit'];
        },
    },
);

const emit = defineEmits<{
    'click:delete': [];
}>();

/**
 * Handle delete button click.
 */
function onDeleteClick(): void {
    emit('click:delete');
}
</script>

<template>
    <ActionMenu :pending="pending">
        <template #trigger="{ toggle }">
            <slot name="trigger" :toggle="toggle"></slot>
        </template>

        <template #navigation>
            <ActionMenuButton
                v-if="actions.includes('members')"
                :icon="faUsers"
                label="Leden bekijken"
                :to="{
                    name: 'manage.authority.members',
                    params: { authorityId: props.authority.id },
                }">
            </ActionMenuButton>
            <ActionMenuButton
                v-if="actions.includes('locations')"
                :icon="faMapLocationDot"
                label="Locaties bekijken"
                :to="{
                    name: 'manage.authority.locations',
                    params: { authorityId: props.authority.id },
                }">
            </ActionMenuButton>
            <ActionMenuButton
                v-if="actions.includes('edit')"
                :icon="faEdit"
                label="Bewerken"
                :to="{
                    name: 'manage.authority.info',
                    params: { authorityId: props.authority.id },
                }">
            </ActionMenuButton>
            <ActionMenuButton
                v-if="actions.includes('delete')"
                :icon="faTrash"
                label="Verwijderen"
                destructive
                @click="onDeleteClick">
            </ActionMenuButton>
        </template>
    </ActionMenu>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
