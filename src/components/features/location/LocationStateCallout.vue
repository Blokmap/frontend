<script setup lang="ts">
import Button from 'primevue/button';
import Callout from '@/components/shared/molecules/Callout.vue';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { LocationState } from '@/domain/location';

defineProps<{
    state: LocationState;
    rejectedReason?: string | null;
}>();

const handleResubmit = () => {
    // TODO: Implement re-submit functionality
    console.log('Re-submit clicked');
};
</script>

<template>
    <Callout v-if="state === LocationState.Pending" severity="info">
        Deze locatie is in afwachting van goedkeuring door een beheerder.
    </Callout>

    <Callout v-else-if="state === LocationState.Rejected" severity="error">
        <div class="flex flex-col gap-3">
            <p class="font-semibold">Deze locatie is afgewezen.</p>
            <p v-if="rejectedReason" class="text-sm">
                <strong>Reden:</strong> {{ rejectedReason }}
            </p>
            <Button
                class="w-auto"
                severity="danger"
                size="small"
                icon-pos="right"
                @click="handleResubmit">
                Opnieuw Indienen
                <FontAwesomeIcon :icon="faArrowRight" />
            </Button>
        </div>
    </Callout>
</template>
