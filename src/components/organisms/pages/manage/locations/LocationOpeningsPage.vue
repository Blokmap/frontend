<script lang="ts" setup>
import ManageBreadcrumb from '@/components/molecules/Breadcrumb.vue';
import LocationOpeningBuilder from '@/components/molecules/location/builder/builders/LocationOpeningBuilder.vue';
import PageContent from '@/components/organisms/pages/PageContent.vue';
import PageTitle from '@/components/organisms/pages/PageTitle.vue';
import { computed, ref, watchEffect } from 'vue';
import {
    useCreateOpeningTimes,
    useDeleteOpeningTime,
    useUpdateOpeningTime,
} from '@/composables/data/useOpeningTimes';
import { type OpeningTimeRequest, openingToRequest } from '@/domain/openings';
import type { Location } from '@/domain/location';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    authProfile: Profile;
    location: Location;
}>();

const { mutateAsync: createOpeningTimes } = useCreateOpeningTimes();
const { mutateAsync: updateOpeningTime } = useUpdateOpeningTime();
const { mutateAsync: deleteOpeningTime } = useDeleteOpeningTime();

const openingsForm = ref<OpeningTimeRequest[]>([]);

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

async function onCreateOpeningTime(openingTime: OpeningTimeRequest): Promise<void> {
    await createOpeningTimes({
        locationId: props.location.id,
        openings: [openingTime],
    });
}

async function onUpdateOpeningTime(
    openingTimeId: number,
    openingTime: OpeningTimeRequest,
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
