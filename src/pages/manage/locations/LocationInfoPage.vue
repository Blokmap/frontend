<script lang="ts" setup>
import LocationInformationBuilder from '@/components/features/location/builder/builders/LocationInformationBuilder.vue';
import ManageBreadcrumb from '@/components/shared/molecules/Breadcrumb.vue';
import SaveBar from '@/components/shared/molecules/SaveBar.vue';
import PageContent from '@/layouts/PageContent.vue';
import PageTitle from '@/layouts/PageTitle.vue';
import { computed } from 'vue';
import { useUpdateLocation } from '@/composables/data/useLocations';
import { useDirtyForm } from '@/composables/useDirtyForm';
import { locationToBody, type Location, type LocationBody } from '@/domain/location';

const props = defineProps<{
    location: Location;
}>();

const { mutateAsync: updateLocation, isPending: isUpdatingLocation } = useUpdateLocation();

const {
    form: locationForm,
    hasChanges,
    isUpdating,
    saveChanges,
    cancelChanges,
} = useDirtyForm({
    isPending: isUpdatingLocation,
    source: () => props.location,
    toForm: locationToBody,
    onSave: async (formData: LocationBody) => {
        await updateLocation({
            locationId: props.location.id,
            data: formData,
        });
    },
});

const breadcrumbs = computed(() => [
    { label: 'Locaties', to: { name: 'manage.locations' } },
    {
        label: props.location.name,
        to: {
            name: 'manage.location.info',
            params: {
                locationId: props.location.id,
            },
        },
    },
    { label: 'Informatie' },
]);
</script>

<template>
    <PageContent>
        <ManageBreadcrumb :items="breadcrumbs" />

        <PageTitle title="Informatie" />

        <LocationInformationBuilder v-if="locationForm" v-model="locationForm">
        </LocationInformationBuilder>

        <SaveBar
            :show="hasChanges"
            :loading="isUpdating"
            @save="saveChanges"
            @cancel="cancelChanges">
        </SaveBar>
    </PageContent>
</template>
