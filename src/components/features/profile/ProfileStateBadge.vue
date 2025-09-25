<script lang="ts" setup>
import Badge from 'primevue/badge';
import {
    faUser,
    faUserSlash,
    faTrash,
    type IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import type { Profile, ProfileState } from '@/domain/profile';

defineProps<{
    profile: Profile;
}>();

const severities: Record<ProfileState, string> = {
    active: 'success',
    disabled: 'danger',
    deleted: 'contrast',
};

const icons: Record<ProfileState, IconDefinition> = {
    active: faUser,
    disabled: faUserSlash,
    deleted: faTrash,
};

const labels: Record<ProfileState, string> = {
    active: 'Actief',
    disabled: 'Banned',
    deleted: 'Verwijderd',
};
</script>

<template>
    <Badge :severity="severities[profile.state]" class="w-[90px]">
        <div class="flex w-full items-center justify-center gap-2">
            <FontAwesomeIcon :icon="icons[profile.state]" />
            <span>{{ labels[profile.state] }}</span>
        </div>
    </Badge>
</template>
