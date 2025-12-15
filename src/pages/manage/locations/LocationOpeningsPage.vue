<script lang="ts" setup>
import LocationOpeningBuilder from '@/components/features/location/builder/builders/LocationOpeningBuilder.vue';
import ManageBreadcrumb from '@/components/shared/molecules/Breadcrumb.vue';
import PageContent from '@/layouts/PageContent.vue';
import PageTitle from '@/layouts/PageTitle.vue';
import { computed, ref, watchEffect } from 'vue';
import {
    useCreateOpeningTimes,
    useDeleteOpeningTime,
    useUpdateOpeningTime,
} from '@/composables/data/useOpeningTimes';
import { type OpeningTimeBody, openingToRequest } from '@/domain/openings';
import type { Location } from '@/domain/location';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    authProfile: Profile;
    location: Location;
}>();

const { mutateAsync: createOpeningTimes } = useCreateOpeningTimes();
const { mutateAsync: updateOpeningTime } = useUpdateOpeningTime();
const { mutateAsync: deleteOpeningTime } = useDeleteOpeningTime();

const openingsForm = ref<OpeningTimeBody[]>([]);

const breadcrumbs = computed(() => [
    { label: 'Mijn locaties', to: { name: 'manage.locations' } },
    { label: props.location?.name ?? 'Locatie', to: { name: 'manage.location.info' } },
    { label: 'Openingsuren' },
]);

// Initialize form when location prop changes
watchEffect(() => {
    if (!props.location || !props.location.openingTimes) {
        return;
    }

    openingsForm.value = props.location.openingTimes.map(openingToRequest);
});

async function onCreateOpeningTime(openingTime: OpeningTimeBody): Promise<void> {
    await createOpeningTimes({
        locationId: props.location.id,
        openings: [openingTime],
    });
}

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

async function onDeleteOpeningTime(openingTimeId: number, sequence?: boolean): Promise<void> {
    await deleteOpeningTime({
        locationId: props.location.id,
        openingTimeId,
        sequence,
    });
}
</script>

<template>
    <PageContent>
        <ManageBreadcrumb :items="breadcrumbs" />

        <PageTitle title="Openingsuren" />

        <LocationOpeningBuilder
            :location="location"
            :opening-times="openingsForm"
            @create="onCreateOpeningTime"
            @update="onUpdateOpeningTime"
            @delete="onDeleteOpeningTime">
        </LocationOpeningBuilder>
    </PageContent>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
