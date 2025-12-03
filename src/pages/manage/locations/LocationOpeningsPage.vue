<script lang="ts" setup>
import LocationOpeningBuilder from '@/components/features/location/builder/builders/LocationOpeningBuilder.vue';
import ManageBreadcrumb from '@/components/shared/molecules/Breadcrumb.vue';
import LayoutContent from '@/layouts/LayoutContent.vue';
import LayoutTitle from '@/layouts/LayoutTitle.vue';
import { computed, ref, watchEffect } from 'vue';
import {
    useCreateOpeningTimes,
    useDeleteOpeningTime,
    useUpdateOpeningTime,
} from '@/composables/data/useOpeningTimes';
import { type OpeningTimeBody, openingToBody } from '@/domain/openings';
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

watchEffect(() => {
    if (!props.location) {
        return;
    }

    const mappedOpenings = (props.location.openingTimes || []).map(openingToBody);
    openingsForm.value = mappedOpenings;
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
    <LayoutContent>
        <ManageBreadcrumb :items="breadcrumbs" />

        <LayoutTitle title="Openingsuren" />

        <LocationOpeningBuilder
            :location="location"
            :opening-times="openingsForm"
            @create="onCreateOpeningTime"
            @update="onUpdateOpeningTime"
            @delete="onDeleteOpeningTime">
        </LocationOpeningBuilder>
    </LayoutContent>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
