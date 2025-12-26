<script lang="ts" setup>
import ActionMenu from '@/components/atoms/menu/ActionMenu.vue';
import ActionMenuButton from '@/components/atoms/menu/ActionMenuButton.vue';
import { faUsers, faUserShield, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import type { Institution } from '@/domain/institution';

type InstitutionAction = 'profiles' | 'authorities' | 'edit' | 'delete';

withDefaults(
    defineProps<{
        institution: Institution;
        pending?: boolean;
        actions?: InstitutionAction[];
    }>(),
    {
        actions: () => {
            return ['profiles', 'authorities', 'edit'];
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
                v-if="actions.includes('profiles')"
                :icon="faUsers"
                label="Gebruikers bekijken"
                :to="{
                    name: 'manage.institution.profiles',
                    params: { institutionId: institution.id },
                }">
            </ActionMenuButton>
            <ActionMenuButton
                v-if="actions.includes('authorities')"
                :icon="faUserShield"
                label="Autoriteiten bekijken"
                :to="{
                    name: 'manage.institution.authorities',
                    params: { institutionId: institution.id },
                }">
            </ActionMenuButton>
            <ActionMenuButton
                v-if="actions.includes('edit')"
                :icon="faEdit"
                label="Bewerken"
                :to="{
                    name: 'manage.institution.info',
                    params: { institutionId: institution.id },
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
