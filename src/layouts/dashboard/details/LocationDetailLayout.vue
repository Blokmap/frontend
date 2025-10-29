<script setup lang="ts">
import Button from 'primevue/button';
import TabNavigation, { type TabItem } from '@/components/shared/molecules/TabNavigation.vue';
import DashboardContent from '@/layouts/dashboard/DashboardContent.vue';
import DashboardLoading from '@/layouts/dashboard/DashboardLoading.vue';
import DashboardNotFound from '@/layouts/dashboard/DashboardNotFound.vue';
import DashboardPageHeader from '@/layouts/dashboard/DashboardPageHeader.vue';
import PageHeaderButton from '@/layouts/dashboard/PageHeaderButton.vue';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import {
    faCalendar,
    faCog,
    faImages,
    faList,
    faSave,
    faSpinner,
    faUsers,
    faUsersGear,
    faWarning,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, watchEffect } from 'vue';
import {
    useReadLocation,
    useUpdateLocation,
    useUpdateLocationImages,
} from '@/composables/data/useLocations';
import { useLocationEditing } from '@/composables/store/useLocationEditing';
import { useToast } from '@/composables/store/useToast';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    locationId: string;
    profile: Profile;
}>();

const toast = useToast();

const editingStore = useLocationEditing();

const tabs = computed<TabItem[]>(() => [
    {
        value: 'info',
        label: 'Informatie',
        icon: faList,
        route: {
            name: 'dashboard.locations.detail.info',
            params: { locationId: props.locationId },
        },
    },
    {
        value: 'reservations',
        label: 'Reservaties',
        icon: faUsers,
        route: {
            name: 'dashboard.locations.detail.reservations',
            params: { locationId: props.locationId },
        },
    },
    {
        value: 'openings',
        label: 'Openingstijden',
        icon: faCalendar,
        route: {
            name: 'dashboard.locations.detail.openings',
            params: { locationId: props.locationId },
        },
    },
    {
        value: 'images',
        label: 'Afbeeldingen',
        icon: faImages,
        route: {
            name: 'dashboard.locations.detail.images',
            params: { locationId: props.locationId },
        },
    },
    {
        value: 'settings',
        label: 'Instellingen',
        align: 'right',
        icon: faCog,
        route: {
            name: 'dashboard.locations.detail.settings',
            params: { locationId: props.locationId },
        },
    },
    {
        value: 'access',
        label: 'Toegangsbeheer',
        align: 'right',
        icon: faUsersGear,
        route: {
            name: 'dashboard.locations.detail.access',
            params: { locationId: props.locationId },
        },
    },
]);

const {
    data: location,
    isLoading,
    error,
} = useReadLocation(
    computed(() => +props.locationId),
    {
        includes: ['images'],
    },
);

const { mutateAsync: updateLocation, isPending: isUpdatingLocation } = useUpdateLocation({
    onSuccess: () => {
        toast.add({
            severity: 'success',
            summary: 'Opgeslagen',
            detail: 'De wijzigingen zijn succesvol opgeslagen.',
        });
    },
});

const { mutateAsync: updateImages, isPending: isUpdatingImages } = useUpdateLocationImages({
    onSuccess: () => {
        toast.add({
            severity: 'success',
            summary: 'Opgeslagen',
            detail: 'De afbeeldingen zijn succesvol bijgewerkt.',
        });
    },
});

const isUpdating = computed(() => isUpdatingLocation.value || isUpdatingImages.value);

watchEffect(() => {
    if (location.value) {
        editingStore.initializeLocation(location.value);
    }
});

/**
 * Saves the changes made to the location and images.
 */
async function saveChanges(): Promise<void> {
    if (!editingStore.locationForm) return;

    try {
        if (editingStore.hasLocationChanges) {
            await updateLocation({
                locationId: +props.locationId,
                data: editingStore.locationForm,
            });
        }

        if (editingStore.hasImagesChanges) {
            const originalImages = JSON.parse(
                JSON.stringify(
                    (location.value?.images || []).map((img) => ({
                        ...img,
                        locationId: +props.locationId,
                    })),
                ),
            );

            await updateImages({
                locationId: +props.locationId,
                originalImages,
                currentImages: editingStore.imagesForm,
            });
        }

        // Update snapshots after successful save
        editingStore.updateSnapshots();
    } catch {
        toast.add({
            severity: 'error',
            summary: 'Fout bij opslaan',
            detail: 'Er is iets misgegaan bij het opslaan van de wijzigingen.',
        });
    }
}
</script>

<template>
    <DashboardContent>
        <!-- Loading State -->
        <DashboardLoading v-if="isLoading" />

        <!-- Not Found State -->
        <DashboardNotFound
            v-else-if="!location || error"
            title="Locatie Niet Gevonden"
            message="De locatie die je zoekt bestaat niet of je hebt geen toegang.">
        </DashboardNotFound>

        <!-- Content -->
        <template v-else>
            <!-- Header -->
            <DashboardPageHeader
                :title="location.name"
                :subtitle="location.excerpt?.nl || undefined">
                <template #actions>
                    <RouterLink :to="{ name: 'locations.detail', params: { locationId } }">
                        <PageHeaderButton severity="secondary" label="Bekijken">
                            <FontAwesomeIcon :icon="faEye" />
                        </PageHeaderButton>
                    </RouterLink>
                </template>
            </DashboardPageHeader>

            <!-- Tabs -->
            <TabNavigation :tabs="tabs" />

            <!-- Page Content -->
            <div class="tab-content">
                <RouterView :location="location" />
            </div>
        </template>
    </DashboardContent>

    <!-- Sticky Save Bar (teleported outside to prevent layout shift) -->
    <Teleport to="body">
        <Transition name="slide-up">
            <div v-if="editingStore.hasChanges" class="save-bar">
                <div class="flex items-center justify-between">
                    <p class="flex items-center font-medium">
                        <FontAwesomeIcon :icon="faWarning" class="mr-2" />
                        Je hebt niet-opgeslagen wijzigingen.
                    </p>
                    <div class="flex">
                        <Button
                            text
                            @click="editingStore.resetChanges"
                            class="text-slate-100 hover:underline">
                            Ongedaan maken
                        </Button>
                        <Button @click="saveChanges" :loading="isUpdating">
                            <FontAwesomeIcon
                                v-if="isUpdating"
                                :icon="faSpinner"
                                spin
                                class="mr-2" />
                            <FontAwesomeIcon :icon="faSave" class="mr-2" v-else />
                            Opslaan
                        </Button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.save-bar {
    @apply fixed bottom-8 left-1/2 z-50 w-full max-w-[700px] -translate-x-1/2 px-6 py-4;
    @apply rounded-full border border-slate-800 bg-slate-900 text-slate-100;
}
</style>
