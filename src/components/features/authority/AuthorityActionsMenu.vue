<script lang="ts" setup>
import ActionMenu from '@/components/shared/atoms/ActionMenu.vue';
import NavigationLink from '@/components/shared/atoms/NavigationLink.vue';
import { faUsers, faMapLocationDot, faEdit } from '@fortawesome/free-solid-svg-icons';
import type { Authority } from '@/domain/authority';

const props = defineProps<{
    authority: Authority;
    isPending?: boolean;
}>();

const navigationActions = [
    {
        label: 'Leden bekijken',
        icon: faUsers,
        to: {
            name: 'dashboard.authorities.detail.members',
            params: { authorityId: props.authority.id },
        },
    },
    {
        label: 'Locaties bekijken',
        icon: faMapLocationDot,
        to: {
            name: 'dashboard.authorities.detail.locations',
            params: { authorityId: props.authority.id },
        },
    },
    {
        label: 'Bewerken',
        icon: faEdit,
        to: {
            name: 'dashboard.authorities.detail.overview',
            params: { authorityId: props.authority.id },
        },
    },
];
</script>

<template>
    <ActionMenu :is-pending="isPending">
        <template #trigger="{ toggle }">
            <slot name="trigger" :toggle="toggle">
                <!-- Default trigger is provided by ActionMenu -->
            </slot>
        </template>

        <template #navigation="{ hideMenu }">
            <NavigationLink
                v-for="action in navigationActions"
                :key="action.label"
                :icon="action.icon"
                :label="action.label"
                :to="action.to"
                @click="hideMenu">
            </NavigationLink>
        </template>
    </ActionMenu>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
