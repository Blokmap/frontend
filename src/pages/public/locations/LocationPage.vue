<script lang="ts" setup>
import Badge from 'primevue/badge';
import Button from 'primevue/button';
import Skeleton from 'primevue/skeleton';
import LocationFeatures from '@/components/features/location/details/LocationFeatures.vue';
import ProfileSection from '@/components/features/location/details/ProfileSection.vue';
import ProfileSectionSkeleton from '@/components/features/location/details/ProfileSectionSkeleton.vue';
import OpeningsTable from '@/components/features/location/openings/OpeningsTable.vue';
import OpeningsTableSkeleton from '@/components/features/location/openings/OpeningsTableSkeleton.vue';
import LocationMap from '@/components/features/map/LocationMap.vue';
import LocationMapSkeleton from '@/components/features/map/LocationMapSkeleton.vue';
import Gallery from '@/components/shared/image/Gallery.vue';
import GallerySkeleton from '@/components/shared/image/GallerySkeleton.vue';
import { faCheckCircle, faLocationDot, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useI18n } from 'vue-i18n';
import { useLocation } from '@/composables/data/useLocations';
import { formatLocationAddress } from '@/domain/location';

const { locationId } = defineProps<{ locationId: string }>();

const { locale } = useI18n();

const {
    data: location,
    isPending,
    isError,
} = useLocation(+locationId, { includes: ['createdBy'] });
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
        <div class="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
            <!-- Hero Section -->
            <div class="space-y-3">
                <!-- Title and Quick Info -->
                <h1 class="text-3xl font-semibold text-gray-900">
                    <template v-if="location">
                        {{ location.name }}
                    </template>
                    <Skeleton v-else-if="isPending" height="36px" width="400px" />
                </h1>

                <!-- Location and Rating Bar -->
                <div class="flex items-center gap-3">
                    <Badge severity="contrast" class="flex items-center gap-2">
                        <FontAwesomeIcon :icon="faLocationDot" class="text-primary" />
                        <span>
                            <template v-if="location">
                                {{ location.city }}, {{ location.street }}
                            </template>
                            <Skeleton v-else-if="isPending" height="16px" width="150px" />
                        </span>
                    </Badge>

                    <Badge
                        v-if="location?.seatCount"
                        severity="contrast"
                        class="flex items-center gap-2">
                        <FontAwesomeIcon :icon="faUsers" class="text-primary" />
                        <span>{{ location.seatCount }} plaatsen</span>
                    </Badge>

                    <Badge v-if="location" severity="contrast" class="flex items-center gap-2">
                        <FontAwesomeIcon class="text-primary" :icon="faCheckCircle" />
                        <span>Geverifieerd</span>
                    </Badge>
                </div>
            </div>

            <!-- Gallery -->
            <div class="h-[480px] overflow-hidden rounded-2xl">
                <Gallery v-if="location?.images" :images="location.images" />
                <GallerySkeleton v-else-if="isPending" />
            </div>

            <!-- Main Content Grid -->
            <div class="grid gap-12 lg:grid-cols-3">
                <!-- Main Content -->
                <div class="space-y-8 lg:col-span-2">
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
                    <div v-if="location" class="border-b border-gray-200 pb-8">
                        <h2 class="mb-6 text-2xl font-semibold text-gray-900">
                            Wat deze plek biedt
                        </h2>
                        <LocationFeatures :location="location" />
                    </div>

                    <!-- Host Section -->
                    <div class="border-b border-gray-200 pb-8">
                        <h2 class="mb-6 text-2xl font-semibold text-gray-900">
                            <template v-if="location"> Over de inzender </template>
                            <Skeleton v-else-if="isPending" height="28px" width="200px" />
                        </h2>
                        <ProfileSection v-if="location?.createdBy" :profile="location.createdBy" />
                        <ProfileSectionSkeleton v-else-if="isPending" />
                    </div>

                    <!-- Location Section -->
                    <div>
                        <h2 class="mb-6 text-2xl font-semibold text-gray-900">
                            <template v-if="location"> Locatie </template>
                            <Skeleton v-else-if="isPending" height="28px" width="200px" />
                        </h2>

                        <div class="space-y-6">
                            <!-- Address Card -->
                            <div
                                v-if="location"
                                class="rounded-xl border border-slate-200 bg-white p-6">
                                <div class="flex items-center gap-3">
                                    <div
                                        class="bg-primary-100 flex h-10 w-10 items-center justify-center rounded-lg">
                                        <FontAwesomeIcon
                                            :icon="faLocationDot"
                                            class="text-primary-600 h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 class="font-semibold text-gray-900">Adres</h3>
                                        <p class="text-gray-600">
                                            {{ formatLocationAddress(location) }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <Skeleton
                                v-else-if="isPending"
                                height="88px"
                                width="100%"
                                class="rounded-xl" />

                            <!-- Map -->
                            <div
                                class="h-[400px] overflow-hidden rounded-xl border border-slate-200">
                                <LocationMap v-if="location" :location="location" />
                                <LocationMapSkeleton v-else-if="isPending" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Sidebar -->
                <div class="lg:col-span-1">
                    <div class="sticky top-8">
                        <!-- Reservation/Hours Card -->
                        <div class="rounded-lg border border-slate-200 bg-white p-6">
                            <div class="mb-6">
                                <h3 class="text-xl font-semibold text-gray-900">
                                    <template v-if="location?.isReservable">
                                        Reserveer een plek
                                    </template>
                                    <template v-else> Openingsuren </template>
                                </h3>
                            </div>

                            <OpeningsTable v-if="location" :opening-times="location.openingTimes" />
                            <OpeningsTableSkeleton v-else-if="isPending" />

                            <!-- Action Button -->
                            <div v-if="location?.isReservable" class="mt-6">
                                <Button class="w-full"> Plek Reserveren </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </template>
</template>
