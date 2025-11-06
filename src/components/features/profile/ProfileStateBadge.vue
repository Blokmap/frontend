<script lang="ts" setup>
import Badge from 'primevue/badge';
import {
    faUser,
    faUserSlash,
    faTrash,
    type IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ProfileState, type Profile } from '@/domain/profile';

defineProps<{
    profile: Profile;
}>();

const severities: Record<ProfileState, string> = {
    [ProfileState.Active]: 'success',
    [ProfileState.Disabled]: 'danger',
    [ProfileState.Deleted]: 'contrast',
};

const icons: Record<ProfileState, IconDefinition> = {
    [ProfileState.Active]: faUser,
    [ProfileState.Disabled]: faUserSlash,
    [ProfileState.Deleted]: faTrash,
};

const labels: Record<ProfileState, string> = {
    [ProfileState.Active]: 'Actief',
    [ProfileState.Disabled]: 'Banned',
    [ProfileState.Deleted]: 'Verwijderd',
};
</script>

<template>
    {{ profile.state }}
    {{ severities }}
    <Badge :severity="severities[profile.state]" class="w-[90px]">
        <div class="flex w-full items-center justify-center gap-2">
            <FontAwesomeIcon :icon="icons[profile.state]" />
            <span>{{ labels[profile.state] }}</span>
        </div>
    </Badge>
</template>
