<template>
    <Badge :severity="severities[status]">
        <div class="space-x-3">
            <FontAwesomeIcon :icon="icons[status]" />
            {{ capitalize(status) }}
        </div>
    </Badge>
</template>

<script lang="ts" setup>
import Badge from 'primevue/badge';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { faCheck, faTimes, type IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { capitalize } from 'vue';
import type { LocationStatus } from '@/domain/location';

defineProps<{
    status: LocationStatus;
}>();

const severities: Record<LocationStatus, string> = {
    approved: 'success',
    pending: 'warning',
    rejected: 'danger',
};

const icons: Record<LocationStatus, IconDefinition> = {
    approved: faCheck,
    pending: faClock,
    rejected: faTimes,
};
</script>
