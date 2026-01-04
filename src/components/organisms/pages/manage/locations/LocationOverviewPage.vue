<script lang="ts" setup>
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Breadcrumb, { type BreadcrumbItem } from '@/components/molecules/Breadcrumb.vue';
import EditorOuput from '@/components/molecules/editor/EditorOuput.vue';
import Gallery from '@/components/molecules/image/Gallery.vue';
import LocationAddressBuilder from '@/components/molecules/location/builder/builders/LocationAddressBuilder.vue';
import LocationImagesBuilder from '@/components/molecules/location/builder/builders/LocationImagesBuilder.vue';
import LocationInformationBuilder from '@/components/molecules/location/builder/builders/LocationInformationBuilder.vue';
import LocationSettingsBuilder from '@/components/molecules/location/builder/builders/LocationSettingsBuilder.vue';
import LocationAddress from '@/components/molecules/location/details/LocationAddress.vue';
import LocationFeatures from '@/components/molecules/location/details/LocationFeatures.vue';
import LocationMap from '@/components/molecules/map/LocationMap.vue';
import OverviewDivider from '@/components/molecules/overview/OverviewDivider.vue';
import OverviewSection from '@/components/molecules/overview/OverviewSection.vue';
import { faCheck, faCogs, faEdit, faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { useUpdateLocation, useUpdateLocationImages } from '@/composables/data/useLocations';
import { useSetLocationTags } from '@/composables/data/useTags';
import { imageToRequest, type ImageRequest } from '@/domain/image';
import { locationToRequest, type LocationRequest, type Location } from '@/domain/location';
import { type Tag } from '@/domain/tag';
import PageContent from '../../PageContent.vue';
import PageTitle from '../../PageTitle.vue';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    authProfile: Profile;
    location: Location;
}>();

const { locale } = useI18n();

const imagesForm = ref<ImageRequest[]>([]);
const imagesSnapshot = ref<string>('');

const isImagesDirty = computed(() => {
    return JSON.stringify(imagesForm.value) !== imagesSnapshot.value;
});

const informationForm = ref<LocationRequest>();
const informationSnapshot = ref<string>('');

const isInformationDirty = computed(() => {
    return JSON.stringify(informationForm.value) !== informationSnapshot.value;
});

const addressForm = ref<LocationRequest>();
const addressSnapshot = ref<string>('');

const isAddressDirty = computed(() => {
    return JSON.stringify(addressForm.value) !== addressSnapshot.value;
});

const settingsForm = ref<LocationRequest>();
const settingsSnapshot = ref<string>('');

const isSettingsDirty = computed(() => {
    return JSON.stringify(settingsForm.value) !== settingsSnapshot.value;
});

const tagsForm = ref<Tag[]>();
const tagsSnapshot = ref<string>('');

const isTagsDirty = computed(() => {
    return JSON.stringify(tagsForm.value) !== tagsSnapshot.value;
});

const showInformationDialog = ref<boolean>(false);
const showImagesDialog = ref<boolean>(false);
const showAddressDialog = ref<boolean>(false);
const showSettingsDialog = ref<boolean>(false);

const { mutateAsync: updateImages, isPending: isUpdatingImages } = useUpdateLocationImages({
    onSuccess: () => {
        showImagesDialog.value = false;
    },
});

const { mutateAsync: updateLocation, isPending: isUpdatingLocation } = useUpdateLocation({
    onSuccess: () => {
        showInformationDialog.value = false;
    },
});

const { mutateAsync: updateAddress, isPending: isUpdatingAddress } = useUpdateLocation({
    onSuccess: () => {
        showAddressDialog.value = false;
    },
});

const { mutateAsync: updateSettings, isPending: isUpdatingSettings } = useUpdateLocation({
    onSuccess: () => {
        showSettingsDialog.value = false;
    },
});

const { mutateAsync: setLocationTags, isPending: isUpdatingTags } = useSetLocationTags({
    onSuccess: () => {
        showInformationDialog.value = false;
    },
});

const onSaveImages = () => {
    const currentImages = imagesForm.value;

    const originalImages = (props.location.images || []).map((img) => {
        const body = imageToRequest(img, img.index);
        return { ...body, locationId: props.location.id };
    });

    updateImages({
        locationId: props.location.id,
        originalImages,
        currentImages,
    });
};

const onSaveInformation = () => {
    if (isTagsDirty.value && tagsForm.value) {
        const tagIds = tagsForm.value.map((tag) => tag.id);

        setLocationTags({
            locationId: props.location.id,
            tagIds,
        });
    }

    if (isInformationDirty.value && informationForm.value) {
        const { name, description, excerpt } = informationForm.value;

        updateLocation({
            locationId: props.location.id,
            data: { name, description, excerpt },
        });
    }
};

const onSaveAddress = () => {
    if (!addressForm.value) return;

    const { street, number, zip, city, country, latitude, longitude } = addressForm.value;

    updateAddress({
        locationId: props.location.id,
        data: { street, number, zip, city, country, latitude, longitude },
    });
};

const onSaveSettings = () => {
    if (!settingsForm.value) return;

    const { seatCount, isReservable, isVisible } = settingsForm.value;

    updateSettings({
        locationId: props.location.id,
        data: { seatCount, isReservable, isVisible },
    });
};

watchEffect(() => {
    const images = props.location.images;

    if (images) {
        const mappedImages = images.map(imageToRequest);
        imagesForm.value = mappedImages;
        imagesSnapshot.value = JSON.stringify(mappedImages);
    }
});

watchEffect(() => {
    const request = locationToRequest(props.location);
    informationForm.value = request;
    informationSnapshot.value = JSON.stringify(request);
});

watchEffect(() => {
    const request = locationToRequest(props.location);
    addressForm.value = request;
    addressSnapshot.value = JSON.stringify(request);
});

watchEffect(() => {
    const request = locationToRequest(props.location);
    settingsForm.value = request;
    settingsSnapshot.value = JSON.stringify(request);
});

watchEffect(() => {
    const request = props.location.tags;
    tagsForm.value = request;
    tagsSnapshot.value = JSON.stringify(request);
});

const breadcrumbs = computed<BreadcrumbItem[]>(() => [
    { label: 'Mijn locaties', to: { name: 'manage.locations' } },
    { label: props.location.name ?? 'Locatie', to: { name: 'manage.location.overview' } },
    { label: 'Overzicht' },
]);
</script>

<template>
    <PageContent>
        <Breadcrumb :items="breadcrumbs" />

        <PageTitle :title="location.name">
            <template #actions>
                <Button @click="showSettingsDialog = true" text>
                    <FontAwesomeIcon :icon="faCogs" />
                    <span>Geavanceerd</span>
                </Button>
            </template>
        </PageTitle>

        <figure class="h-[400px]">
            <Gallery
                :images="location.images ?? []"
                :fullscreen="false"
                @click:fullscreen="showImagesDialog = true">
                <template #label>
                    <span>Bewerk {{ imagesForm.length }} Foto's</span>
                </template>
            </Gallery>
        </figure>

        <OverviewSection :title="location.name" :subtitle="location.excerpt[locale]">
            <template #actions>
                <Button @click="showInformationDialog = true" text>
                    <FontAwesomeIcon :icon="faEdit" />
                    <span>Aanpassen</span>
                </Button>
            </template>

            <EditorOuput v-if="location.description" :data="location.description[locale]" />
        </OverviewSection>

        <OverviewDivider />

        <OverviewSection title="Voorzieningen">
            <template #actions>
                <Button @click="showInformationDialog = true" text>
                    <FontAwesomeIcon :icon="faEdit" />
                    <span>Aanpassen</span>
                </Button>
            </template>
            <LocationFeatures :location="location" />
        </OverviewSection>

        <OverviewDivider />

        <OverviewSection title="Geolocatie">
            <template #actions>
                <Button @click="showAddressDialog = true" text>
                    <FontAwesomeIcon :icon="faEdit" />
                    <span>Aanpassen</span>
                </Button>
            </template>

            <div class="space-y-6">
                <LocationAddress :location="location" />

                <figure class="h-[250px] overflow-hidden rounded-2xl md:h-[500px]">
                    <LocationMap
                        :center="[location.longitude, location.latitude]"
                        :zoom="17"
                        :interactive="false"
                        :geo-location-control="false">
                    </LocationMap>
                </figure>
            </div>
        </OverviewSection>

        <Teleport to="body">
            <Dialog
                class="w-full max-w-4xl overflow-y-auto"
                v-model:visible="showImagesDialog"
                modal>
                <template #container>
                    <LocationImagesBuilder v-model="imagesForm">
                        <template #actions>
                            <Button
                                @click="onSaveImages"
                                :disabled="!isImagesDirty"
                                :loading="isUpdatingImages">
                                <FontAwesomeIcon :icon="faCheck" />
                                <span>Opslaan</span>
                            </Button>
                            <Button severity="contrast" @click="showImagesDialog = false" rounded>
                                <template #icon>
                                    <FontAwesomeIcon :icon="faX" />
                                </template>
                            </Button>
                        </template>
                    </LocationImagesBuilder>
                </template>
            </Dialog>

            <Dialog
                class="w-full max-w-4xl overflow-y-auto"
                v-model:visible="showInformationDialog"
                modal>
                <template #container>
                    <LocationInformationBuilder
                        v-if="informationForm"
                        v-model="informationForm"
                        v-model:tags="tagsForm">
                        <template #actions>
                            <Button
                                @click="onSaveInformation"
                                :disabled="!isInformationDirty && !isTagsDirty"
                                :loading="isUpdatingLocation || isUpdatingTags">
                                <FontAwesomeIcon :icon="faCheck" />
                                <span>Opslaan</span>
                            </Button>
                            <Button
                                severity="contrast"
                                @click="showInformationDialog = false"
                                rounded>
                                <template #icon>
                                    <FontAwesomeIcon :icon="faX" />
                                </template>
                            </Button>
                        </template>
                    </LocationInformationBuilder>
                </template>
            </Dialog>

            <Dialog
                class="w-full max-w-4xl overflow-y-auto"
                v-model:visible="showAddressDialog"
                modal>
                <template #container>
                    <LocationAddressBuilder v-if="addressForm" v-model="addressForm">
                        <template #actions>
                            <Button
                                @click="onSaveAddress"
                                :disabled="!isAddressDirty"
                                :loading="isUpdatingAddress">
                                <FontAwesomeIcon :icon="faCheck" />
                                <span>Opslaan</span>
                            </Button>
                            <Button severity="contrast" @click="showAddressDialog = false" rounded>
                                <template #icon>
                                    <FontAwesomeIcon :icon="faX" />
                                </template>
                            </Button>
                        </template>
                    </LocationAddressBuilder>
                </template>
            </Dialog>

            <Dialog
                class="w-full max-w-4xl overflow-y-auto"
                v-model:visible="showSettingsDialog"
                modal>
                <template #container>
                    <LocationSettingsBuilder v-if="settingsForm" v-model:form="settingsForm">
                        <template #actions>
                            <Button severity="contrast" @click="showSettingsDialog = false">
                                <FontAwesomeIcon :icon="faX" />
                                <span>Annuleren</span>
                            </Button>
                            <Button
                                @click="onSaveSettings"
                                :disabled="!isSettingsDirty"
                                :loading="isUpdatingSettings">
                                <FontAwesomeIcon :icon="faCheck" />
                                <span>Opslaan</span>
                            </Button>
                        </template>
                    </LocationSettingsBuilder>
                </template>
            </Dialog>
        </Teleport>
    </PageContent>
</template>

<style scoped></style>
