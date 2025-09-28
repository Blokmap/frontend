<script lang="ts" setup>
import ActionMenu from '@/components/shared/atoms/ActionMenu.vue';
import { faUsers, faUserShield, faMapLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
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

        <template #content="{ hideMenu }">
            <div class="space-y-1">
                <RouterLink
                    v-for="action in actions"
                    :key="action.label"
                    :to="action.to"
                    class="flex w-full items-center gap-3 rounded-md px-2 py-1 text-sm text-slate-700 transition-colors hover:bg-slate-100"
                    @click="hideMenu">
                    <FontAwesomeIcon :icon="action.icon" class="text-slate-700" />
                    <span>{{ action.label }}</span>
                </RouterLink>
            </div>
        </template>
    </ActionMenu>
</template>
