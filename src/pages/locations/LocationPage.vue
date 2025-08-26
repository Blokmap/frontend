<script lang="ts" setup>
import OpeningsTable from '@/components/features/location/openings/OpeningsTable.vue';
import LocationMap from '@/components/features/map/LocationMap.vue';
import ProfileAvatar from '@/components/features/profile/avatar/ProfileAvatar.vue';
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
            <template v-if="location">
                <h1 class="text-2xl font-semibold" v-if="location">
                    {{ location.name }}
                </h1>
                <div class="h-[425px]">
                    <Gallery :images="location.images" />
                </div>
                <div class="flex gap-8">
                    <!-- Location Information -->
                    <div class="w-2/3 space-y-7">
                        <div class="flex items-center justify-between gap-3">
                            <h2 class="text-xl font-medium">
                                {{ location.excerpt[locale] }}
                            </h2>
                            <Badge color="green" icon="pi pi-check" severity="success">
                                <FontAwesomeIcon :icon="faCheckCircle" class="mr-1" />
                                Geverifieerd
                            </Badge>
                        </div>
                        <p class="text-sm text-slate-500">
                            {{ location.description[locale] }}
                        </p>
                        <template v-if="profile">
                            <div class="flex gap-6 border-y-2 border-slate-200 py-3">
                                <ProfileAvatar class="w-14" :profile="profile" />
                                <div class="space-y-1">
                                    <h3 class="text-lg font-medium">
                                        Geregistreerd door {{ profile.firstName }}
                                    </h3>
                                    <p class="text-sm text-slate-500">
                                        Lid sinds
                                        {{
                                            profile.createdAt.toLocaleDateString(locale, {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })
                                        }}
                                    </p>
                                </div>
                            </div>
                        </template>
                        <h2 class="text-lg font-medium">
                            {{ formatLocationAddress(location) }}
                        </h2>
                        <div class="h-[350px]">
                            <LocationMap
                                class="rounded-lg border-2 border-slate-200"
                                :location="location">
                            </LocationMap>
                        </div>
                    </div>

                    <!-- Sidebar with opening hours -->
                    <div class="sticky top-4 w-1/3">
                        <OpeningsTable :opening-times="location.openingTimes" />
                    </div>
                </div>
            </template>
            <template v-else-if="isLoading">
                <Skeleton height="32px" />
                <div class="h-[425px]">
                    <GallerySkeleton />
                </div>
            </template>
            <template v-else> </template>
        </div>
    </template>
</template>
