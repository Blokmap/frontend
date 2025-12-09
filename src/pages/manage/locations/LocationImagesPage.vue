<script lang="ts" setup>
import LocationImagesBuilder from '@/components/features/location/builder/builders/LocationImagesBuilder.vue';
import ManageBreadcrumb from '@/components/shared/molecules/Breadcrumb.vue';
import SaveBar from '@/components/shared/molecules/SaveBar.vue';
import PageContent from '@/layouts/PageContent.vue';
import PageTitle from '@/layouts/PageTitle.vue';
import { computed } from 'vue';
import { useUpdateLocationImages } from '@/composables/data/useLocations';
import { useDirtyForm } from '@/composables/useDirtyForm';
import { imageToBody, type ImageBody } from '@/domain/image';
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
    toForm: (location) => (location.images || []).map(imageToBody),
    onSave: async (currentImages) => {
        const originalImages: ImageBody[] = (props.location.images || []).map((img) => {
            const body = imageToBody(img, img.index);
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
