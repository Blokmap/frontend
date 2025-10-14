<script lang="ts" setup>
import Badge from 'primevue/badge';
import Button from 'primevue/button';
import Skeleton from 'primevue/skeleton';
import AddressCard from '@/components/features/location/details/LocationAddressCard.vue';
import LocationFeatures from '@/components/features/location/details/LocationFeatures.vue';
import ProfileSection from '@/components/features/location/details/LocationProfile.vue';
import ProfileSectionSkeleton from '@/components/features/location/details/LocationProfileSkeleton.vue';
import OpeningsTable from '@/components/features/location/openings/OpeningsTable.vue';
import OpeningsTableSkeleton from '@/components/features/location/openings/OpeningsTableSkeleton.vue';
import LocationMap from '@/components/features/map/LocationMap.vue';
import LocationMapSkeleton from '@/components/features/map/LocationMapSkeleton.vue';
import ReservationBuilderDialog from '@/components/features/reservation/ReservationBuilderDialog.vue';
import CalendarControls from '@/components/shared/molecules/calendar/CalendarControls.vue';
import Gallery from '@/components/shared/organisms/image/Gallery.vue';
import GallerySkeleton from '@/components/shared/organisms/image/GallerySkeleton.vue';
import {
    faArrowRight,
    faCheckCircle,
    faLocationDot,
    faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import placeholder from '@/assets/img/placeholder/location-stock-2.jpg';
import { useAuthProfile } from '@/composables/data/useAuth';
import { useReadLocation } from '@/composables/data/useLocations';
import { useReadOpeningTimes } from '@/composables/data/useOpeningTimes';
import { usePageTitleStore } from '@/composables/store/usePageTitle';
import { pushRedirectUrl } from '@/domain/auth';

const { locationId, reservation } = defineProps<{ locationId: string; reservation: string }>();

const { locale } = useI18n();
const { setPageTitle } = usePageTitleStore();

const route = useRoute();
const router = useRouter();

const currentWeek = ref<Date>(new Date());

const { profileId } = useAuthProfile();

const {
    data: location,
    isPending,
    isError,
} = useReadLocation(
    computed(() => +locationId),
    { includes: ['createdBy'] },
);

const {
    data: openingTimes,
    isPending: openingTimesIsPending,
    isError: _openingTimesIsError,
} = useReadOpeningTimes(
    computed(() => +locationId),
    currentWeek,
);

const showReservationDialog = computed<boolean>(() => reservation === 'reservation');

watch(
    location,
    (newLocation) => {
        if (newLocation) {
            setPageTitle(newLocation.name);
        }
    },
    { immediate: true },
);

// Initialize currentWeek from query parameter if present
watch(
    () => route.query.week,
    (weekParam) => {
        if (weekParam && typeof weekParam === 'string') {
            const date = new Date(weekParam);
            if (!isNaN(date.getTime())) {
                currentWeek.value = date;
            }
        }
    },
    { immediate: true },
);

/**
 * Navigate to the same location page but with the reservation query parameter set
 * to open the reservation dialog.
 */
function onReserveClick(): void {
    const reservation = 'reservation';

    router.push({
        name: 'locations.detail',
        params: { locationId, reservation },
    });
}

/**
 * Navigate to the login page, storing the current location page as redirect URL
 */
function onLoginClick(): void {
    const route = router.resolve({
        name: 'locations.detail',
        params: { locationId, reservation: 'reservation' },
    });

    pushRedirectUrl(route.fullPath);

    router.push({ name: 'auth' });
}

/**
 * Close the reservation dialog by unsetting the query parameter
 */
function onDialogClose(): void {
    router.push({
        name: 'locations.detail',
        params: { locationId },
    });
}
</script>

<template>
    <template v-if="isError">
        <div class="flex min-h-screen items-center justify-center">
            <div class="text-center">
                <h2 class="text-2xl font-semibold text-gray-900">Locatie niet gevonden</h2>
                <p class="mt-2 text-gray-600">De locatie die je zoekt bestaat niet.</p>
            </div>
        </div>
    </template>
    <template v-else>
        <div class="space-y-8">
            <!-- Hero Section -->
            <div class="space-y-3">
                <!-- Title and Quick Info -->
                <h1 class="text-3xl font-semibold text-gray-900">
                    <template v-if="location">
                        {{ location.name }}
                    </template>
                    <Skeleton v-else-if="isPending" height="36px" width="400px" />
                </h1>

                <!-- Tags -->
                <div class="flex items-center gap-3" v-if="location">
                    <Badge severity="contrast" class="flex items-center gap-2 border-0 p-0">
                        <FontAwesomeIcon :icon="faLocationDot" class="text-primary" />
                        <span> {{ location.city }}, {{ location.street }} </span>
                    </Badge>

                    <Badge severity="contrast" class="flex items-center gap-2 border-0 p-0">
                        <FontAwesomeIcon :icon="faUsers" class="text-primary" />
                        <span>{{ location.seatCount }} plaatsen</span>
                    </Badge>

                    <Badge severity="contrast" class="flex items-center gap-2 border-0 p-0">
                        <FontAwesomeIcon class="text-primary" :icon="faCheckCircle" />
                        <span>Geverifieerd</span>
                    </Badge>
                </div>
            </div>

            <!-- Gallery -->
            <div class="h-[480px] overflow-hidden rounded-2xl">
                <Gallery
                    v-if="location?.images"
                    :images="location.images"
                    :placeholder="placeholder">
                </Gallery>
                <GallerySkeleton v-else-if="isPending" />
            </div>

            <!-- Content Grid -->
            <div class="grid gap-6 lg:grid-cols-3">
                <!-- Main Content -->
                <div class="space-y-6 lg:col-span-2">
                    <!-- Description Section -->
                    <div class="border-b border-gray-200 pb-8">
                        <h2 class="mb-4 text-2xl font-semibold text-gray-900">
                            <template v-if="location">
                                {{ location.excerpt[locale] }}
                            </template>
                            <Skeleton v-else-if="isPending" height="28px" width="400px" />
                        </h2>

                        <div class="space-y-4">
                            <p class="leading-relaxed text-gray-600">
                                <template v-if="location">
                                    {{ location.description[locale] }}
                                </template>
                                <template v-else-if="isPending">
                                    <Skeleton height="18px" width="100%" class="mb-2" />
                                    <Skeleton height="18px" width="90%" class="mb-2" />
                                    <Skeleton height="18px" width="80%" />
                                </template>
                            </p>
                        </div>
                    </div>

                    <!-- Features Section -->
                    <div v-if="location" class="space-y-6 border-b border-gray-200 pb-8">
                        <h2 class="text-2xl font-semibold text-gray-900">
                            Wat deze bloklocatie biedt
                        </h2>
                        <LocationFeatures :location="location" />
                    </div>

                    <!-- Host Section -->
                    <div
                        class="space-y-6 border-b border-gray-200 pb-8"
                        v-if="isPending || location?.createdBy">
                        <h2 class="text-2xl font-semibold text-gray-900">
                            <template v-if="location"> Over de inzender </template>
                            <Skeleton v-else-if="isPending" height="28px" width="200px" />
                        </h2>
                        <ProfileSection v-if="location?.createdBy" :profile="location.createdBy" />
                        <ProfileSectionSkeleton v-else-if="isPending" />
                    </div>

                    <!-- Location Section -->
                    <div class="space-y-6">
                        <h2 class="text-2xl font-semibold text-gray-900">
                            <template v-if="location"> Locatie op kaart </template>
                            <Skeleton v-else-if="isPending" height="28px" width="200px" />
                        </h2>

                        <!-- Address Card -->
                        <AddressCard v-if="location" :location="location" />

                        <Skeleton
                            v-else-if="isPending"
                            height="88px"
                            width="100%"
                            class="rounded-xl">
                        </Skeleton>

                        <!-- Map -->
                        <div class="h-[400px] overflow-hidden rounded-xl border border-slate-200">
                            <LocationMap v-if="location" :location="location" />
                            <LocationMapSkeleton v-else-if="isPending" />
                        </div>
                    </div>
                </div>

                <!-- Sidebar -->
                <div class="lg:col-span-1">
                    <div class="sticky top-8">
                        <!-- Reservation/Hours Card -->
                        <div class="rounded-xl border border-slate-200 bg-white p-6">
                            <h3 class="text-xl font-semibold text-gray-900">
                                <template v-if="location?.isReservable">
                                    Reserveer een plek
                                </template>
                                <template v-else> Openingsuren </template>
                            </h3>

                            <div class="my-6">
                                <div class="space-y-6" v-if="location">
                                    <CalendarControls v-model:date="currentWeek" />
                                    <OpeningsTable
                                        :opening-times="openingTimes"
                                        :current-week="currentWeek"
                                        :is-loading="openingTimesIsPending">
                                    </OpeningsTable>
                                </div>
                                <OpeningsTableSkeleton v-else-if="isPending" />
                            </div>

                            <!-- Action Button or No Reservation Needed -->
                            <template v-if="location?.isReservable">
                                <Button class="w-full" @click="onReserveClick" v-if="profileId">
                                    Plek Reserveren
                                    <FontAwesomeIcon :icon="faArrowRight" />
                                </Button>
                                <Button
                                    class="w-full"
                                    severity="secondary"
                                    @click="onLoginClick"
                                    v-else>
                                    Inloggen om te reserveren
                                    <FontAwesomeIcon :icon="faArrowRight" />
                                </Button>
                            </template>
                            <template v-else-if="location && !location.isReservable">
                                <div class="text-center">Geen reservatie nodig 🥳</div>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Reservation Builder Dialog -->
        <ReservationBuilderDialog
            v-if="location"
            v-model:date="currentWeek"
            :location="location"
            :visible="showReservationDialog"
            @update:visible="onDialogClose">
        </ReservationBuilderDialog>
    </template>
</template>
