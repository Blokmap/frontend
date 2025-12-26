<script lang="ts" setup>
import ManageBreadcrumb from '@/components/molecules/Breadcrumb.vue';
import SaveBar from '@/components/molecules/SaveBar.vue';
import LocationInformationBuilder from '@/components/molecules/location/builder/builders/LocationInformationBuilder.vue';
import PageContent from '@/components/organisms/pages/PageContent.vue';
import PageTitle from '@/components/organisms/pages/PageTitle.vue';
import { computed } from 'vue';
import { useUpdateLocation } from '@/composables/data/useLocations';
import { useDirtyForm } from '@/composables/useDirtyForm';
import { locationToRequest, type Location, type LocationRequest } from '@/domain/location';

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
    toForm: locationToRequest,
    onSave: async (formData: LocationRequest) => {
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
