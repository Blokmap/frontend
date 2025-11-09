<script setup lang="ts">
import LocationOpeningBuilder from '@/components/features/location/builder/builders/LocationOpeningBuilder.vue';
import DashboardContent from '@/layouts/dashboard/DashboardContent.vue';
import { ref, watchEffect } from 'vue';
import {
    useCreateOpeningTimes,
    useDeleteOpeningTime,
    useUpdateOpeningTime,
} from '@/composables/data/useOpeningTimes';
import { openingToBody } from '@/domain/openings';
import type { Location } from '@/domain/location';
import type { OpeningTimeBody } from '@/domain/openings';

const props = defineProps<{
    location: Location;
}>();

const { mutateAsync: createOpeningTimes } = useCreateOpeningTimes({});
const { mutateAsync: updateOpeningTime } = useUpdateOpeningTime({});
const { mutateAsync: deleteOpeningTime } = useDeleteOpeningTime({});

const openingsForm = ref<OpeningTimeBody[]>([]);

watchEffect(() => {
    if (!props.location) return;
    const mappedOpenings = (props.location.openingTimes || []).map(openingToBody);
    openingsForm.value = mappedOpenings;
});

/**
 * Handles creation of a new opening time
 */
async function onCreateOpeningTime(openingTime: OpeningTimeBody): Promise<void> {
    await createOpeningTimes({
        locationId: props.location.id,
        openings: [openingTime],
    });
}

/**
 * Handles updating an existing opening time
 */
async function onUpdateOpeningTime(
    openingTimeId: number,
    openingTime: OpeningTimeBody,
    sequence?: boolean,
): Promise<void> {
    await updateOpeningTime({
        locationId: props.location.id,
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
        locationId: props.location.id,
        openingTimeId,
        sequence,
    });
}
</script>

<template>
    <DashboardContent>
        <LocationOpeningBuilder
            :location="location"
            :opening-times="openingsForm"
            @create="onCreateOpeningTime"
            @update="onUpdateOpeningTime"
            @delete="onDeleteOpeningTime">
        </LocationOpeningBuilder>
    </DashboardContent>
</template>
