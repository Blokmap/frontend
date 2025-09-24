<template>
    <Badge :severity="severities[location.state]" class="w-[90px]" v-tooltip.top="'helalur'">
        <div class="flex w-full items-center justify-around gap-1">
            <FontAwesomeIcon :icon="icons[location.state]" />
            <span>{{ capitalize(location.state) }}</span>
        </div>
    </Badge>
</template>

<script lang="ts" setup>
import Badge from 'primevue/badge';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { faCheck, faTimes, type IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { capitalize } from 'vue';
import type { Location, LocationState } from '@/domain/location';

defineProps<{
    location: Location;
}>();

const severities: Record<LocationState, string> = {
    approved: 'success',
    pending: 'info',
    rejected: 'danger',
};

const icons: Record<LocationState, IconDefinition> = {
    approved: faCheck,
    pending: faClock,
    rejected: faTimes,
};
</script>
