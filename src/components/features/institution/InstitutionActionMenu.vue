<script lang="ts" setup>
import ActionMenu from '@/components/shared/atoms/menu/ActionMenu.vue';
import ActionMenuButton from '@/components/shared/atoms/menu/ActionMenuButton.vue';
import {
    faUsers,
    faUserShield,
    faMapLocationDot,
    faEdit,
    faTrash,
} from '@fortawesome/free-solid-svg-icons';
import type { Institution } from '@/domain/institution';

const props = withDefaults(
    defineProps<{
        institution: Institution;
        isPending?: boolean;
        showProfiles?: boolean;
        showAuthorities?: boolean;
        showLocations?: boolean;
        showEdit?: boolean;
        showDelete?: boolean;
    }>(),
    {
        showProfiles: true,
        showAuthorities: true,
        showLocations: true,
        showEdit: false,
        showDelete: false,
    },
);

const emit = defineEmits<{
    'click:edit': [];
    'click:delete': [];
}>();

/**
 * Handle edit button click.
 */
function onEditClick(): void {
    emit('click:edit');
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

        <template #navigation>
            <ActionMenuButton
                v-if="showProfiles"
                :icon="faUsers"
                label="Gebruikers bekijken"
                :to="{
                    name: 'dashboard.profiles.index',
                    query: { institutionSlug: props.institution.slug },
                }" />
            <ActionMenuButton
                v-if="showAuthorities"
                :icon="faUserShield"
                label="Autoriteiten bekijken"
                :to="{
                    name: 'dashboard.authorities.index',
                    query: { institutionSlug: props.institution.slug },
                }" />
            <ActionMenuButton
                v-if="showLocations"
                :icon="faMapLocationDot"
                label="Locaties bekijken"
                :to="{
                    name: 'dashboard.locations.index',
                    query: { institutionSlug: props.institution.slug },
                }" />
            <ActionMenuButton
                v-if="showEdit"
                :icon="faEdit"
                label="Bewerken"
                @click="onEditClick" />
            <ActionMenuButton
                v-if="showDelete"
                :icon="faTrash"
                label="Verwijderen"
                destructive
                @click="onDeleteClick" />
        </template>
    </ActionMenu>
</template>
