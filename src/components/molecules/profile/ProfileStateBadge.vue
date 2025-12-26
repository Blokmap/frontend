<script lang="ts" setup>
import Badge from 'primevue/badge';
import {
    faUser,
    faUserSlash,
    faTrash,
    type IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ProfileState } from '@/domain/profile';

defineProps<{
    state: ProfileState;
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
    <Badge :severity="severities[state]" class="w-[110px]">
        <div class="flex w-full items-center justify-center gap-2">
            <FontAwesomeIcon :icon="icons[state]" />
            <span>{{ labels[state] }}</span>
        </div>
    </Badge>
</template>
