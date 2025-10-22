<script setup lang="ts">
import Button from 'primevue/button';
import Tab from 'primevue/tab';
import TabList from 'primevue/tablist';
import Tabs from 'primevue/tabs';
import DashboardContent from '@/layouts/dashboard/DashboardContent.vue';
import DashboardLoading from '@/layouts/dashboard/DashboardLoading.vue';
import DashboardNotFound from '@/layouts/dashboard/DashboardNotFound.vue';
import DashboardPageHeader from '@/layouts/dashboard/DashboardPageHeader.vue';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import {
    faCalendar,
    faCog,
    faImages,
    faList,
    faSave,
    faSpinner,
    faUsers,
    faWarning,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, watchEffect } from 'vue';
import { useRouter, useRoute } from 'vue-router';
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
const router = useRouter();
const route = useRoute();

const editingStore = useLocationEditing();

const activeTab = computed<string>(() => {
    const routeName = route.name?.toString() || '';

    if (routeName.includes('reservations')) return 'reservations';
    if (routeName.includes('openings')) return 'openings';
    if (routeName.includes('images')) return 'images';
    if (routeName.includes('settings')) return 'settings';

    return 'info';
});

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

/**
 * Navigate to a specific tab
 */
function navigateToTab(tab: string): void {
    const routeMap: Record<string, string> = {
        info: 'dashboard.locations.detail.info',
        reservations: 'dashboard.locations.detail.reservations',
        openings: 'dashboard.locations.detail.openings',
        images: 'dashboard.locations.detail.images',
        settings: 'dashboard.locations.detail.settings',
    };

    router.push({
        name: routeMap[tab],
        params: {
            locationId: props.locationId,
        },
    });
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
                        <Button severity="secondary">
                            <FontAwesomeIcon :icon="faEye" />
                            <span>Bekijken</span>
                        </Button>
                    </RouterLink>
                </template>
            </DashboardPageHeader>

            <!-- Tabs -->
            <div class="tabs-wrapper">
                <Tabs :value="activeTab" class="text-sm">
                    <TabList>
                        <Tab value="info" @click="navigateToTab('info')">
                            <FontAwesomeIcon :icon="faList" class="tab-icon" />
                            <span class="tab-label">Informatie</span>
                        </Tab>
                        <Tab value="reservations" @click="navigateToTab('reservations')">
                            <FontAwesomeIcon :icon="faUsers" class="tab-icon" />
                            <span class="tab-label">Reservaties</span>
                        </Tab>
                        <Tab value="openings" @click="navigateToTab('openings')">
                            <FontAwesomeIcon :icon="faCalendar" class="tab-icon" />
                            <span class="tab-label">Openingstijden</span>
                        </Tab>
                        <Tab value="images" @click="navigateToTab('images')">
                            <FontAwesomeIcon :icon="faImages" class="tab-icon" />
                            <span class="tab-label">Afbeeldingen</span>
                        </Tab>
                        <Tab value="settings" class="ml-auto" @click="navigateToTab('settings')">
                            <FontAwesomeIcon :icon="faCog" class="tab-icon" />
                            <span class="tab-label">Instellingen</span>
                        </Tab>
                    </TabList>
                </Tabs>
            </div>

            <!-- Page Content -->
            <div class="tab-content">
                <RouterView />
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

.tabs-wrapper {
    @apply -mx-3 overflow-x-auto px-3;
    @apply md:mx-0 md:overflow-visible md:px-0;
}

.tab-icon {
    @apply mr-2;
}

.tab-label {
    @apply hidden md:inline;
}

.save-bar {
    @apply fixed bottom-8 left-1/2 z-50 w-full max-w-[700px] -translate-x-1/2 px-6 py-4;
    @apply rounded-full border border-slate-800 bg-slate-900 text-slate-100;
}
</style>
