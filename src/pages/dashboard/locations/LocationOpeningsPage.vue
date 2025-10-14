<script setup lang="ts">
import LocationOpeningBuilder from '@/components/features/location/builder/builders/LocationOpeningBuilder.vue';
import { ref, watchEffect } from 'vue';
import {
    useCreateOpeningTimes,
    useDeleteOpeningTime,
    useUpdateOpeningTime,
} from '@/composables/data/useOpeningTimes';
import { useLocationEditing } from '@/composables/store/useLocationEditing';
import { useToast } from '@/composables/store/useToast';
import { openingToRequest } from '@/domain/openings';
import type { OpeningTimeRequest } from '@/domain/openings';

const props = defineProps<{
    locationId: string;
}>();

const toast = useToast();
const editingStore = useLocationEditing();

const { mutateAsync: createOpeningTimes } = useCreateOpeningTimes({
    onSuccess: () => {
        toast.add({
            severity: 'success',
            summary: 'Openingstijd toegevoegd',
            detail: 'De openingstijd is succesvol toegevoegd.',
        });
    },
    onError: () => {
        toast.add({
            severity: 'error',
            summary: 'Fout bij toevoegen',
            detail: 'Er is iets misgegaan bij het toevoegen van de openingstijd.',
        });
    },
});

const { mutateAsync: updateOpeningTime } = useUpdateOpeningTime({
    onSuccess: () => {
        toast.add({
            severity: 'success',
            summary: 'Openingstijd bijgewerkt',
            detail: 'De openingstijd is succesvol bijgewerkt.',
        });
    },
    onError: () => {
        toast.add({
            severity: 'error',
            summary: 'Fout bij bijwerken',
            detail: 'Er is iets misgegaan bij het bijwerken van de openingstijd.',
        });
    },
});

const { mutateAsync: deleteOpeningTime } = useDeleteOpeningTime({
    onSuccess: () => {
        toast.add({
            severity: 'success',
            summary: 'Openingstijd verwijderd',
            detail: 'De openingstijd is succesvol verwijderd.',
        });
    },
    onError: () => {
        toast.add({
            severity: 'error',
            summary: 'Fout bij verwijderen',
            detail: 'Er is iets misgegaan bij het verwijderen van de openingstijd.',
        });
    },
});

const openingsForm = ref<OpeningTimeRequest[]>([]);

watchEffect(() => {
    if (!editingStore.location) return;

    // Map openings to form format
    const mappedOpenings = (editingStore.location.openingTimes || []).map(openingToRequest);
    openingsForm.value = mappedOpenings;
});

/**
 * Handles creation of a new opening time
 */
async function onCreateOpeningTime(openingTime: OpeningTimeRequest): Promise<void> {
    try {
        await createOpeningTimes({
            locationId: +props.locationId,
            openings: [openingTime],
        });
    } catch {
        // Error is handled by onError callback
    }
}

/**
 * Handles updating an existing opening time
 */
async function onUpdateOpeningTime(
    openingTimeId: number,
    openingTime: OpeningTimeRequest,
    sequence?: boolean,
): Promise<void> {
    updateOpeningTime({
        locationId: +props.locationId,
        openingTimeId,
        opening: openingTime,
        sequence,
    });
}

/**
 * Handles deletion of an opening time
 */
async function onDeleteOpeningTime(openingTimeId: number, sequence?: boolean): Promise<void> {
    deleteOpeningTime({
        locationId: +props.locationId,
        openingTimeId,
        sequence,
    });
}
</script>

<template>
    <LocationOpeningBuilder
        :opening-times="openingsForm"
        @create="onCreateOpeningTime"
        @update="onUpdateOpeningTime"
        @delete="onDeleteOpeningTime">
    </LocationOpeningBuilder>
</template>
