<script lang="ts" setup>
import Badge from 'primevue/badge';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { LocationState, type Location } from '@/domain/location';
import type { IconDefinition } from '@fortawesome/fontawesome-common-types';

defineProps<{
    location: Location;
}>();

const severities: Record<LocationState, string> = {
    [LocationState.Approved]: 'success',
    [LocationState.Pending]: 'info',
    [LocationState.Rejected]: 'danger',
};

const icons: Record<LocationState, IconDefinition> = {
    [LocationState.Approved]: faCheck,
    [LocationState.Pending]: faClock,
    [LocationState.Rejected]: faTimes,
};
</script>

<template>
    <Badge
        :severity="severities[location.state]"
        v-tooltip.top="$t('domains.locations.state.' + location.state + '.description')">
        <div
            class="flex w-full items-center justify-around gap-1"
            v-tooltip.top="location.rejectedReason">
            <FontAwesomeIcon :icon="icons[location.state]" />
            <span>{{ $t('domains.locations.state.' + location.state + '.label') }}</span>
        </div>
    </Badge>
</template>
