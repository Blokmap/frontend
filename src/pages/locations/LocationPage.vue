<script lang="ts" setup>
import ProfileSection from '@/components/features/location/details/ProfileSection.vue';
import ProfileSectionSkeleton from '@/components/features/location/details/ProfileSectionSkeleton.vue';
import OpeningsTable from '@/components/features/location/openings/OpeningsTable.vue';
import OpeningsTableSkeleton from '@/components/features/location/openings/OpeningsTableSkeleton.vue';
import LocationMap from '@/components/features/map/LocationMap.vue';
import LocationMapSkeleton from '@/components/features/map/LocationMapSkeleton.vue';
import Gallery from '@/components/shared/image/Gallery.vue';
import GallerySkeleton from '@/components/shared/image/GallerySkeleton.vue';
import { useAuthProfile } from '@/composables/data/useAuth';
import { useLocation } from '@/composables/data/useLocations';
import { formatLocationAddress } from '@/domain/location';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Badge from 'primevue/badge';
import Skeleton from 'primevue/skeleton';
import { useI18n } from 'vue-i18n';

const { locationId } = defineProps<{ locationId: number }>();

const { locale } = useI18n();

const { data: profile } = useAuthProfile();

const {
    data: location,
    isPending: isLoading,
    isError,
    error,
    isFetched,
} = useLocation(locationId, { includes: ['created_by'] });
</script>
<template>
    <template v-if="isError"> </template>
    <template v-else>
        <div class="mx-auto max-w-[1080px] space-y-7">
            <!-- Title -->
            <h1 class="text-2xl font-semibold">
                <template v-if="location">{{ location.name }}</template>
                <Skeleton v-else-if="isLoading" height="32px" width="300px" />
            </h1>

            <!-- Gallery -->
            <div class="h-[425px]">
                <Gallery v-if="location" :images="location.images" />
                <GallerySkeleton v-else-if="isLoading" />
            </div>

            <div class="flex gap-8">
                <!-- Location Information -->
                <div class="w-2/3 space-y-7">
                    <!-- Excerpt and Badge -->
                    <div class="flex items-center justify-between gap-3">
                        <h2 class="text-xl font-medium">
                            <template v-if="location">{{ location.excerpt[locale] }}</template>
                            <Skeleton v-else-if="isLoading" height="28px" width="400px" />
                        </h2>
                        <template v-if="location">
                            <Badge color="green" icon="pi pi-check" severity="success">
                                <FontAwesomeIcon :icon="faCheckCircle" class="mr-1" />
                                Geverifieerd
                            </Badge>
                        </template>
                        <Skeleton v-else-if="isLoading" height="24px" width="100px" />
                    </div>

                    <!-- Description -->
                    <p class="text-sm text-slate-500">
                        <template v-if="location">{{ location.description[locale] }}</template>
                        <template v-else-if="isLoading">
                            <Skeleton height="16px" width="100%" class="mb-2" />
                            <Skeleton height="16px" width="80%" />
                        </template>
                    </p>

                    <!-- Profile Section -->
                    <ProfileSection v-if="location && profile" :profile="profile" />
                    <ProfileSectionSkeleton v-else-if="isLoading" />

                    <!-- Address -->
                    <h2 class="text-lg font-medium">
                        <template v-if="location">{{ formatLocationAddress(location) }}</template>
                        <Skeleton v-else-if="isLoading" height="24px" width="250px" />
                    </h2>

                    <!-- Map -->
                    <div class="h-[350px]">
                        <LocationMap v-if="location" :location="location"> </LocationMap>
                        <LocationMapSkeleton v-else-if="isLoading" />
                    </div>
                </div>

                <!-- Sidebar with opening hours -->
                <div class="sticky top-4 w-1/3">
                    <OpeningsTable v-if="location" :opening-times="location.openingTimes" />
                    <OpeningsTableSkeleton v-else-if="isLoading" />
                </div>
            </div>
        </div>
    </template>
</template>
