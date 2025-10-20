<script setup lang="ts">
import Button from 'primevue/button';
import Tab from 'primevue/tab';
import TabList from 'primevue/tablist';
import Tabs from 'primevue/tabs';
import DashboardLoading from '@/layouts/dashboard/DashboardLoading.vue';
import DashboardNotFound from '@/layouts/dashboard/DashboardNotFound.vue';
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

const props = defineProps<{
    locationId: string;
}>();

const toast = useToast();
const router = useRouter();
const route = useRoute();

const editingStore = useLocationEditing();

// Determine active tab from route name
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
    <!-- Loading State -->
    <DashboardLoading v-if="isLoading" />

    <!-- Not Found State -->
    <DashboardNotFound
        v-else-if="!location || error"
        title="Locatie Niet Gevonden"
        message="De locatie die je zoekt bestaat niet of je hebt geen toegang.">
    </DashboardNotFound>

    <!-- Content -->
    <div v-else class="relative space-y-6">
        <!-- Header -->
        <div>
            <h1 class="text-3xl font-semibold">
                {{ location.name }}
            </h1>
            <p v-if="location.excerpt?.nl" class="mt-2 text-gray-600">
                {{ location.excerpt.nl }}
            </p>
        </div>

        <!-- Tabs -->
        <Tabs :value="activeTab" class="text-sm">
            <TabList>
                <Tab value="info" @click="navigateToTab('info')">
                    <FontAwesomeIcon :icon="faList" class="mr-2" />
                    <span>Informatie</span>
                </Tab>
                <Tab value="reservations" @click="navigateToTab('reservations')">
                    <FontAwesomeIcon :icon="faUsers" class="mr-2" />
                    <span>Reservaties</span>
                </Tab>
                <Tab value="openings" @click="navigateToTab('openings')">
                    <FontAwesomeIcon :icon="faCalendar" class="mr-2" />
                    <span>Openingstijden</span>
                </Tab>
                <Tab value="images" @click="navigateToTab('images')">
                    <FontAwesomeIcon :icon="faImages" class="mr-2" />
                    <span>Afbeeldingen</span>
                </Tab>
                <Tab value="settings" class="ml-auto" @click="navigateToTab('settings')">
                    <FontAwesomeIcon :icon="faCog" class="mr-2" />
                    <span>Instellingen</span>
                </Tab>
            </TabList>
        </Tabs>

        <!-- Page Content -->
        <div class="tab-content">
            <RouterView />
        </div>
    </div>

    <!-- Sticky Save Bar (teleported outside to prevent layout shift) -->
    <Teleport to="body">
        <Transition name="slide-up">
            <div v-if="editingStore.hasChanges" class="save-bar">
                <div class="save-bar__content">
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
    @apply fixed bottom-8 left-1/2 z-50 w-[650px] max-w-full -translate-x-1/2 px-6 py-4;
    @apply rounded-full border border-slate-800 bg-slate-900 text-slate-100;

    .save-bar__content {
        @apply flex items-center justify-between;
    }
}
</style>
