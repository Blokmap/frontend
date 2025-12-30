<script lang="ts" setup>
import ManageBreadcrumb from '@/components/molecules/Breadcrumb.vue';
import SaveBar from '@/components/molecules/SaveBar.vue';
import LocationImagesBuilder from '@/components/molecules/location/builder/builders/LocationImagesBuilder.vue';
import PageContent from '@/components/organisms/pages/PageContent.vue';
import PageTitle from '@/components/organisms/pages/PageTitle.vue';
import { computed } from 'vue';
import { useUpdateLocationImages } from '@/composables/data/useLocations';
import { useDirtyForm } from '@/composables/useDirtyForm';
import { imageToRequest, type ImageRequest } from '@/domain/image';
import type { Location } from '@/domain/location';

const props = defineProps<{
    location: Location;
}>();

const { mutateAsync: updateImages, isPending: isUpdatingImages } = useUpdateLocationImages();

const {
    form: imagesForm,
    hasChanges,
    isUpdating,
    saveChanges,
    cancelChanges,
} = useDirtyForm({
    source: () => props.location,
    toForm: (location) => (location.images || []).map(imageToRequest),
    onSave: async (currentImages) => {
        const originalImages: ImageRequest[] = (props.location.images || []).map((img) => {
            const body = imageToRequest(img, img.index);
            return { ...body, locationId: props.location.id };
        });

        await updateImages({
            locationId: props.location.id,
            originalImages,
            currentImages,
        });
    },
    isPending: isUpdatingImages,
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
    { label: 'Afbeeldingen' },
]);
</script>

<template>
    <PageContent>
        <ManageBreadcrumb :items="breadcrumbs" />

        <PageTitle title="Afbeeldingen" />

        <LocationImagesBuilder v-if="imagesForm" v-model="imagesForm" />

        <SaveBar
            :show="hasChanges"
            :loading="isUpdating"
            @save="saveChanges"
            @cancel="cancelChanges" />
    </PageContent>
</template>
