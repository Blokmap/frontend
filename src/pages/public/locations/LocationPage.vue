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
import placeholder from '@/assets/img/placeholder/location-stock-2.jpg';
import { useLocation } from '@/composables/data/useLocations';
import { useOpeningTimes } from '@/composables/data/useOpeningTimes';
import { usePageTitleStore } from '@/composables/store/usePageTitle';

const { locationId } = defineProps<{ locationId: string }>();

const { locale } = useI18n();
const { setPageTitle } = usePageTitleStore();

const currentWeek = ref(new Date());

const {
    data: location,
    isPending,
    isError,
} = useLocation(
    computed(() => +locationId),
    { includes: ['createdBy'] },
);

const {
    data: openingTimes,
    isPending: openingTimesIsPending,
    isError: _openingTimesIsError,
} = useOpeningTimes(
    computed(() => +locationId),
    currentWeek,
);

function handlePreviousWeek(): void {
    const newDate = new Date(currentWeek.value);
    newDate.setDate(newDate.getDate() - 7);
    currentWeek.value = newDate;
}

function handleNextWeek(): void {
    const newDate = new Date(currentWeek.value);
    newDate.setDate(newDate.getDate() + 7);
    currentWeek.value = newDate;
}

function handleCurrentWeek(): void {
    currentWeek.value = new Date();
}

function handleDateSelect(date: Date): void {
    currentWeek.value = date;
}

watch(
    location,
    (newLocation) => {
        if (newLocation) {
            setPageTitle(newLocation.name);
        }
    },
    { immediate: true },
);
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
                                    <CalendarControls
                                        :current-week="currentWeek"
                                        @click:previous-week="handlePreviousWeek"
                                        @click:next-week="handleNextWeek"
                                        @click:current-week="handleCurrentWeek"
                                        @select:date="handleDateSelect" />
                                    <OpeningsTable
                                        :opening-times="openingTimes"
                                        :current-week="currentWeek"
                                        :is-loading="openingTimesIsPending" />
                                </div>
                                <OpeningsTableSkeleton v-else-if="isPending" />
                            </div>

                            <!-- Action Button or No Reservation Needed -->
                            <template v-if="location?.isReservable">
                                <Button class="w-full">
                                    Plek Reserveren
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
    </template>
</template>
