<script lang="ts" setup>
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import ManageBreadcrumb, { type BreadcrumbItem } from '@/components/molecules/Breadcrumb.vue';
import EntityCard from '@/components/molecules/EntityCard.vue';
import AuthorityInformationBuilder from '@/components/molecules/authority/builder/AuthorityInformationBuilder.vue';
import BlokMap from '@/components/molecules/map/BlokMap.vue';
import OverviewSection from '@/components/molecules/overview/OverviewSection.vue';
import PageContent from '@/components/organisms/pages/PageContent.vue';
import PageTitle from '@/components/organisms/pages/PageTitle.vue';
import { faBuilding, faCheck, faEdit, faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, ref, useTemplateRef, watch, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import {
    useUpdateAuthority,
    useUpdateAuthorityLogo,
    useDeleteAuthorityLogo,
} from '@/composables/data/useAuthorities';
import { useReadAuthorityLocations } from '@/composables/data/useLocations';
import { useMapBox } from '@/composables/maps';
import { type Authority, type AuthorityRequest, authorityToRequest } from '@/domain/authority';
import { getInstitutionName } from '@/domain/institution';
import { locationsToCoordinates } from '@/domain/location/helpers/locationConverters';
import { calculateBounds, calculateCenter } from '@/domain/map/mapHelpers';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    authProfile: Profile;
    authority: Authority;
}>();

const { locale } = useI18n();
const router = useRouter();

const authorityId = computed<number>(() => {
    return props.authority.id;
});

const { data: locations, isLoading } = useReadAuthorityLocations(authorityId);

const coordinates = computed(() => {
    if (!locations.value || locations.value.length === 0) {
        return [];
    }
    return locationsToCoordinates(locations.value);
});

const locationBounds = computed(() => calculateBounds(coordinates.value, 0.1));
const mapCenter = computed(() => calculateCenter(locationBounds.value));

const mapContainer = useTemplateRef<InstanceType<typeof BlokMap>>('blokmap');
const mapContainerEl = computed<HTMLElement | null>(() => mapContainer.value?.$el);

const map = useMapBox(mapContainerEl, {
    center: mapCenter,
    zoom: 12,
    clustering: true,
});

// Fit bounds when locations load
watch(
    [() => locations.value, map.isLoaded],
    async ([locs, loaded]) => {
        if (!loaded || !locs || locs.length === 0 || !locationBounds.value) {
            return;
        }

        await map.flyToBounds(locationBounds.value);

        // Cap at max zoom of 16
        if (map.zoom.value > 16) {
            await map.flyTo(map.center.value, 16);
        }
    },
    { immediate: true },
);

const { mutateAsync: updateAuthority, isPending: isUpdatingAuthority } = useUpdateAuthority();

const informationForm = ref<AuthorityRequest>();
const informationSnapshot = ref<string>('');

const isInformationDirty = computed(() => {
    return JSON.stringify(informationForm.value) !== informationSnapshot.value;
});

const showInformationDialog = ref<boolean>(false);

const onSaveInformation = async () => {
    if (!informationForm.value) return;

    const { name, description } = informationForm.value;

    await updateAuthority({
        id: props.authority.id,
        data: { name, description, institutionId: informationForm.value.institutionId },
    });

    showInformationDialog.value = false;
};

const { mutateAsync: updateLogo, isPending: isUpdatingLogo } = useUpdateAuthorityLogo();

const onLogoUpdate = async (file: File) => {
    await updateLogo({ authorityId: props.authority.id, file });
};

const { mutateAsync: deleteLogo, isPending: isDeletingLogo } = useDeleteAuthorityLogo();

const onLogoDelete = async () => {
    await deleteLogo(props.authority.id);
};

const logoDialogVisible = ref<boolean>(false);

const onLocationClick = (locationId: number) => {
    router.push({
        name: 'manage.location.overview',
        params: { locationId },
    });
};

watchEffect(() => {
    const request = authorityToRequest(props.authority);
    informationForm.value = request;
    informationSnapshot.value = JSON.stringify(request);
});

const breadcrumbs = computed<BreadcrumbItem[]>(() => {
    const institutionId = props.authority.institution?.id;
    const institutionName = getInstitutionName(props.authority.institution, locale.value);

    return [
        {
            label: institutionName,
            to: {
                name: 'manage.institution.overview',
                params: {
                    institutionId,
                },
            },
        },
        {
            label: props.authority.name,
            to: {
                name: 'manage.authority.overview',
                params: {
                    authorityId: props.authority.id,
                },
            },
        },
        {
            label: 'Informatie',
        },
    ];
});
</script>

<template>
    <PageContent>
        <ManageBreadcrumb :items="breadcrumbs" />

        <PageTitle :title="authority.name" />

        <EntityCard
            :image="authority.logo?.url"
            :icon="faBuilding"
            :avatar-editable="true"
            :updating="isUpdatingLogo"
            :deleting="isDeletingLogo"
            v-model:avatar-dialog-visible="logoDialogVisible"
            @update:avatar="onLogoUpdate"
            @delete:avatar="onLogoDelete">
            <template #avatar-dialog-title>
                <h2 class="text-xl font-semibold">Logo</h2>
            </template>
            <template #avatar-dialog-subtitle>
                <p class="mt-2 text-slate-600">Upload het logo van deze groep</p>
            </template>
            <template #content>
                <div class="space-y-2">
                    <div class="flex items-start justify-between">
                        <div>
                            <h2 class="text-2xl font-bold">{{ authority.name }}</h2>
                            <p v-if="authority.description" class="text-sm text-gray-500">
                                {{ authority.description }}
                            </p>
                        </div>
                        <Button @click="showInformationDialog = true" text size="small">
                            <FontAwesomeIcon :icon="faEdit" />
                        </Button>
                    </div>
                </div>
            </template>
        </EntityCard>

        <OverviewSection title="Locaties">
            <BlokMap
                class="h-[600px] rounded"
                ref="blokmap"
                :map="map"
                :locations="locations"
                :loading="isLoading"
                @click:location="onLocationClick"
                rounded>
            </BlokMap>
        </OverviewSection>

        <Teleport to="body">
            <Dialog
                class="w-full max-w-4xl overflow-y-auto"
                v-model:visible="showInformationDialog"
                modal>
                <template #container>
                    <AuthorityInformationBuilder v-if="informationForm" v-model="informationForm">
                        <template #actions>
                            <Button
                                @click="onSaveInformation"
                                :disabled="!isInformationDirty"
                                :loading="isUpdatingAuthority">
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
                    </AuthorityInformationBuilder>
                </template>
            </Dialog>
        </Teleport>
    </PageContent>
</template>
