<script lang="ts" setup>
import ActionMenu from '@/components/shared/atoms/ActionMenu.vue';
import NavigationLink from '@/components/shared/atoms/NavigationLink.vue';
import { faUsers, faUserShield, faMapLocationDot } from '@fortawesome/free-solid-svg-icons';
import type { Institution } from '@/domain/institution';

const props = defineProps<{
    institution: Institution;
    isPending?: boolean;
}>();

const actions = [
    {
        label: 'Gebruikers bekijken',
        icon: faUsers,
        to: {
            name: 'dashboard.profiles.index',
            query: { institutionSlug: props.institution.slug },
        },
    },
    {
        label: 'Autoriteiten bekijken',
        icon: faUserShield,
        to: {
            name: 'dashboard.authorities.index',
            query: { institutionSlug: props.institution.slug },
        },
    },
    {
        label: 'Locaties bekijken',
        icon: faMapLocationDot,
        to: {
            name: 'dashboard.locations.index',
            query: { institutionSlug: props.institution.slug },
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
                v-for="action in actions"
                :key="action.label"
                :icon="action.icon"
                :label="action.label"
                :to="action.to"
                @click="hideMenu" />
        </template>
    </ActionMenu>
</template>
