<script setup lang="ts">
import LocationOpeningBuilder from '@/components/features/location/builder/builders/LocationOpeningBuilder.vue';
import DashboardContent from '@/layouts/dashboard/DashboardContent.vue';
import { ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
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
    locationId: number;
}>();

const toast = useToast();
const { t } = useI18n();
const editingStore = useLocationEditing();

const { mutateAsync: createOpeningTimes } = useCreateOpeningTimes({
    onSuccess: () => {
        toast.add({
            severity: 'success',
            summary: t('domains.openings.success.created'),
            detail: t('domains.openings.success.createdDetail'),
        });
    },
    onError: () => {
        toast.add({
            severity: 'error',
            summary: t('domains.openings.errors.createFailed'),
            detail: t('domains.openings.errors.createFailedDetail'),
        });
    },
});

const { mutateAsync: updateOpeningTime } = useUpdateOpeningTime({
    onSuccess: () => {
        toast.add({
            severity: 'success',
            summary: t('domains.openings.success.updated'),
            detail: t('domains.openings.success.updatedDetail'),
        });
    },
    onError: () => {
        toast.add({
            severity: 'error',
            summary: t('domains.openings.errors.updateFailed'),
            detail: t('domains.openings.errors.updateFailedDetail'),
        });
    },
});

const { mutateAsync: deleteOpeningTime } = useDeleteOpeningTime({
    onSuccess: () => {
        toast.add({
            severity: 'success',
            summary: t('domains.openings.success.deleted'),
            detail: t('domains.openings.success.deletedDetail'),
        });
    },
    onError: () => {
        toast.add({
            severity: 'error',
            summary: t('domains.openings.errors.deleteFailed'),
            detail: t('domains.openings.errors.deleteFailedDetail'),
        });
    },
});

const openingsForm = ref<OpeningTimeRequest[]>([]);

watchEffect(() => {
    if (!editingStore.location) return;
    const mappedOpenings = (editingStore.location.openingTimes || []).map(openingToRequest);
    openingsForm.value = mappedOpenings;
});

/**
 * Handles creation of a new opening time
 */
async function onCreateOpeningTime(openingTime: OpeningTimeRequest): Promise<void> {
    await createOpeningTimes({
        locationId: +props.locationId,
        openings: [openingTime],
    });
}

/**
 * Handles updating an existing opening time
 */
async function onUpdateOpeningTime(
    openingTimeId: number,
    openingTime: OpeningTimeRequest,
    sequence?: boolean,
): Promise<void> {
    await updateOpeningTime({
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
    await deleteOpeningTime({
        locationId: +props.locationId,
        openingTimeId,
        sequence,
    });
}
</script>

<template>
    <DashboardContent>
        <LocationOpeningBuilder
            :opening-times="openingsForm"
            @create="onCreateOpeningTime"
            @update="onUpdateOpeningTime"
            @delete="onDeleteOpeningTime">
        </LocationOpeningBuilder>
    </DashboardContent>
</template>
