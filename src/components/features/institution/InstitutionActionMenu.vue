<script lang="ts" setup>
import ActionMenu from '@/components/shared/atoms/menu/ActionMenu.vue';
import ActionMenuButton from '@/components/shared/atoms/menu/ActionMenuButton.vue';
import { faUsers, faUserShield, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import type { Institution } from '@/domain/institution';

withDefaults(
    defineProps<{
        institution: Institution;
        pending?: boolean;
        showProfiles?: boolean;
        showAuthorities?: boolean;
        showEdit?: boolean;
        showDelete?: boolean;
    }>(),
    {
        showProfiles: true,
        showAuthorities: true,
        showEdit: false,
        showDelete: false,
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
                v-if="showProfiles"
                :icon="faUsers"
                label="Gebruikers bekijken"
                :to="{
                    name: 'dashboard.institutions.detail.users',
                    params: { institutionId: institution.id },
                }">
            </ActionMenuButton>
            <ActionMenuButton
                v-if="showAuthorities"
                :icon="faUserShield"
                label="Autoriteiten bekijken"
                :to="{
                    name: 'dashboard.institutions.detail.authorities',
                    params: { institutionId: institution.id },
                }">
            </ActionMenuButton>
            <ActionMenuButton
                v-if="showEdit"
                :icon="faEdit"
                label="Bewerken"
                :to="{
                    name: 'dashboard.institutions.detail.overview',
                    params: { institutionId: institution.id },
                }">
            </ActionMenuButton>
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
