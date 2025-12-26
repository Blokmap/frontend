<script lang="ts" setup>
import Badge from 'primevue/badge';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';
import { LocationState, type Location } from '@/domain/location';
import type { IconDefinition } from '@fortawesome/fontawesome-common-types';

const props = defineProps<{
    location?: Location;
    state: LocationState;
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

const state = computed<LocationState>(() => {
    return props.location ? props.location.state : props.state;
});
</script>

<template>
    <Badge
        :severity="severities[state]"
        v-tooltip.top="$t('domains.locations.state.' + state + '.description')">
        <div
            class="flex w-full items-center justify-around gap-1"
            v-tooltip.top="location?.rejectedReason">
            <FontAwesomeIcon :icon="icons[state]" />
            <span>{{ $t('domains.locations.state.' + state + '.label') }}</span>
        </div>
    </Badge>
</template>
