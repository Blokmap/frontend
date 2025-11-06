<script lang="ts" setup>
import ActionMenu from '@/components/shared/atoms/menu/ActionMenu.vue';
import ActionMenuButton from '@/components/shared/atoms/menu/ActionMenuButton.vue';
import { faUsers, faMapLocationDot, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import type { Authority } from '@/domain/authority';

const props = withDefaults(
    defineProps<{
        authority: Authority;
        isPending?: boolean;
        showMembers?: boolean;
        showLocations?: boolean;
        showEdit?: boolean;
        showDelete?: boolean;
    }>(),
    {
        showMembers: true,
        showLocations: true,
        showEdit: true,
        showDelete: false,
    },
);

const emit = defineEmits<{
    'click:delete': [authorityId: number];
}>();

/**
 * Handle delete button click.
 */
function onDeleteClick(): void {
    emit('click:delete', props.authority.id);
}
</script>

<template>
    <ActionMenu :is-pending="isPending">
        <template #trigger="{ toggle }">
            <slot name="trigger" :toggle="toggle" />
        </template>

        <template #navigation>
            <ActionMenuButton
                v-if="showMembers"
                :icon="faUsers"
                label="Leden bekijken"
                :to="{
                    name: 'dashboard.authorities.detail.members',
                    params: { authorityId: props.authority.id },
                }" />
            <ActionMenuButton
                v-if="showLocations"
                :icon="faMapLocationDot"
                label="Locaties bekijken"
                :to="{
                    name: 'dashboard.authorities.detail.locations',
                    params: { authorityId: props.authority.id },
                }" />
            <ActionMenuButton
                v-if="showEdit"
                :icon="faEdit"
                label="Bewerken"
                :to="{
                    name: 'dashboard.authorities.detail.overview',
                    params: { authorityId: props.authority.id },
                }" />
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
