<script lang="ts" setup>
import LocationSettingsBuilder from '@/components/features/location/builder/builders/LocationSettingsBuilder.vue';
import ManageBreadcrumb from '@/components/shared/molecules/Breadcrumb.vue';
import SaveBar from '@/components/shared/molecules/SaveBar.vue';
import PageContent from '@/layouts/PageContent.vue';
import PageTitle from '@/layouts/PageTitle.vue';
import { computed } from 'vue';
import { useUpdateLocation } from '@/composables/data/useLocations';
import { useReadProfileAuthorityMemberships } from '@/composables/data/useMembers';
import { useDirtyForm } from '@/composables/useDirtyForm';
import { locationToBody, type Location } from '@/domain/location';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    authProfile: Profile;
    location: Location;
}>();

const { data: authorities } = useReadProfileAuthorityMemberships(
    computed(() => props.authProfile.id),
);

const { mutateAsync: updateLocation, isPending: isUpdatingLocation } = useUpdateLocation();

const {
    form: locationForm,
    hasChanges,
    isUpdating,
    saveChanges,
    cancelChanges,
} = useDirtyForm({
    source: () => props.location,
    toForm: locationToBody,
    onSave: async (formData) => {
        await updateLocation({ locationId: props.location.id, data: formData });
    },
    isPending: isUpdatingLocation,
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
    { label: 'Instellingen' },
]);
</script>

<template>
    <PageContent>
        <ManageBreadcrumb :items="breadcrumbs" />

        <PageTitle title="Instellingen" />

        <LocationSettingsBuilder
            v-if="locationForm"
            :authorities="authorities"
            v-model:form="locationForm">
        </LocationSettingsBuilder>

        <SaveBar
            :show="hasChanges"
            :loading="isUpdating"
            @save="saveChanges"
            @cancel="cancelChanges" />
    </PageContent>
</template>
