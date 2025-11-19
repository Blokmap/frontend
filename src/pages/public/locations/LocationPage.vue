<script lang="ts" setup>
import Button from 'primevue/button';
import Skeleton from 'primevue/skeleton';
import Textarea from 'primevue/textarea';
import AddressCard from '@/components/features/location/details/LocationAddressCard.vue';
import LocationFeatures from '@/components/features/location/details/LocationFeatures.vue';
import LocationMap from '@/components/features/map/LocationMap.vue';
import LocationMapSkeleton from '@/components/features/map/LocationMapSkeleton.vue';
import OpeningsTable from '@/components/features/openings/OpeningsTable.vue';
import OpeningsTableSkeleton from '@/components/features/openings/OpeningsTableSkeleton.vue';
import ReservationBuilderDialog from '@/components/features/reservation/builder/ReservationBuilderDialog.vue';
import ConfirmDialog from '@/components/shared/molecules/ConfirmDialog.vue';
import CalendarControls from '@/components/shared/molecules/calendar/CalendarControls.vue';
import EditorOuput from '@/components/shared/molecules/editor/EditorOuput.vue';
import Gallery from '@/components/shared/organisms/image/Gallery.vue';
import GallerySkeleton from '@/components/shared/organisms/image/GallerySkeleton.vue';
import PageHeaderButton from '@/layouts/dashboard/PageHeaderButton.vue';
import PublicContent from '@/layouts/public/PublicContent.vue';
import { faArrowRight, faBullhorn, faEdit, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import placeholder from '@/assets/img/placeholder/location-stock-1.jpg';
import { useAuthProfile } from '@/composables/data/useAuth';
import { useReadLocation } from '@/composables/data/useLocations';
import { useReadOpeningTimes } from '@/composables/data/useOpeningTimes';
import { useCreateLocationReport } from '@/composables/data/useReports';
import { usePageTitleStore } from '@/composables/store/usePageTitle';
import { useRouteDate } from '@/composables/useRouteDate';
import { pushRedirectUrl } from '@/domain/auth';

const { locationId } = defineProps<{ locationId: string }>();

const { locale } = useI18n();
const { setPageTitle } = usePageTitleStore();

const router = useRouter();
const route = useRoute();

const currentWeek = useRouteDate({ paramName: 'week' });

const { profileId, data: profile } = useAuthProfile();

const { data: location, isPending } = useReadLocation(
    computed(() => +locationId),
    { includes: ['createdBy'] },
);

const {
    data: openingTimes,
    isPending: openingTimesIsPending,
    isError: _openingTimesIsError,
} = useReadOpeningTimes(
    computed(() => +locationId),
    computed(() => ({ inWeekOf: currentWeek.value })),
);

const showReservationDialog = computed<boolean>({
    get: () => route.hash === '#reservations' && !!profile.value,
    set: (value: boolean) => {
        if (value) {
            router.replace({ hash: '#reservations' });
        } else {
            router.replace({ hash: '' });
        }
    },
});

watch(
    location,
    (newLocation) => {
        if (newLocation) {
            setPageTitle(newLocation.name);
        }
    },
    { immediate: true },
);

const showReportDialog = ref(false);
const reportReason = ref('');

const { mutateAsync: createReport, isPending: isCreatingReport } = useCreateLocationReport({
    onSuccess: () => {
        showReportDialog.value = false;
        reportReason.value = '';
    },
});

function onReportClick(): void {
    showReportDialog.value = true;
    reportReason.value = '';
}

function onCancelReport(): void {
    showReportDialog.value = false;
    reportReason.value = '';
}

function onConfirmReport(): void {
    if (!reportReason.value.trim()) {
        return;
    }

    createReport({
        locationId: +locationId,
        reason: reportReason.value,
    });
}

function onLoginClick(): void {
    const redirectRoute = router.resolve({
        name: 'locations.detail',
        params: { locationId },
        hash: '#reservations',
    });

    pushRedirectUrl(redirectRoute.fullPath);

    router.push({ name: 'auth' });
}
</script>

<template>
    <PublicContent>
        <!-- Title and Quick Info -->
        <div class="flex items-center justify-between gap-3">
            <h1 class="text-3xl font-semibold text-gray-900" data-testid="location-name">
                <template v-if="location">
                    {{ location.name }}
                </template>
                <Skeleton v-else-if="isPending" height="36px" width="400px" />
            </h1>
            <div class="flex space-x-3">
                <template v-if="profile?.isAdmin">
                    <RouterLink
                        :to="{
                            name: 'dashboard.locations.detail.reservations',
                            params: { locationId },
                        }"
                        v-if="location && location?.isReservable">
                        <PageHeaderButton
                            severity="contrast"
                            :label="$t('domains.reservations.name', 2)">
                            <FontAwesomeIcon :icon="faUsers" />
                        </PageHeaderButton>
                    </RouterLink>

                    <Skeleton v-else-if="isPending" height="36px" width="120px" />

                    <RouterLink
                        :to="{
                            name: 'dashboard.locations.detail.info',
                            params: { locationId },
                        }">
                        <PageHeaderButton severity="secondary" :label="$t('general.actions.edit')">
                            <FontAwesomeIcon :icon="faEdit" />
                        </PageHeaderButton>
                    </RouterLink>
                </template>

                <template v-if="profileId && !isPending">
                    <PageHeaderButton severity="contrast" @click="onReportClick" text>
                        <FontAwesomeIcon :icon="faBullhorn" />
                    </PageHeaderButton>
                </template>
            </div>
        </div>

        <!-- Content Grid -->
        <div class="grid gap-6 lg:grid-cols-3">
            <!-- Main Content -->
            <div class="space-y-6 lg:col-span-2">
                <!-- Gallery -->
                <div class="h-[450px] overflow-hidden rounded-2xl" v-if="location?.images?.length">
                    <Gallery :images="location.images" :placeholder="placeholder"> </Gallery>
                    <GallerySkeleton v-if="isPending" />
                </div>

                <!-- Description Section -->
                <div class="max-w-[850px] py-6">
                    <h2 class="mb-6 text-2xl font-semibold text-gray-900">
                        <template v-if="location">
                            {{ location.excerpt[locale] }}
                        </template>
                        <Skeleton v-else-if="isPending" height="28px" width="400px" />
                    </h2>

                    <div class="space-y-4">
                        <template v-if="location">
                            <EditorOuput :data="location.description[locale]" />
                        </template>
                        <template v-else-if="isPending">
                            <Skeleton height="18px" width="100%" class="mb-2" />
                            <Skeleton height="18px" width="90%" class="mb-2" />
                            <Skeleton height="18px" width="80%" />
                        </template>
                    </div>
                </div>

                <!-- Features Section -->
                <div v-if="location" class="space-y-6 pb-6">
                    <h2 class="text-2xl font-semibold text-gray-900">
                        {{ $t('pages.locations.sections.features.title') }}
                    </h2>
                    <LocationFeatures :location="location" />
                </div>

                <!-- Location Section -->
                <div class="space-y-6">
                    <h2 class="text-2xl font-semibold text-gray-900">
                        <template v-if="location">
                            {{ $t('pages.locations.sections.geolocation.title') }}
                        </template>
                        <Skeleton v-else-if="isPending" height="28px" width="200px" />
                    </h2>

                    <!-- Address Card -->
                    <AddressCard v-if="location" :location="location" />

                    <Skeleton v-else-if="isPending" height="88px" width="100%" class="rounded-xl">
                    </Skeleton>

                    <!-- Map -->
                    <div class="h-[400px] overflow-hidden rounded-xl shadow-sm">
                        <LocationMap
                            v-if="location"
                            :center="[location.longitude, location.latitude]"
                            :zoom="17"
                            :interactive="false"
                            :geo-location-control="false">
                        </LocationMap>
                        <LocationMapSkeleton v-else-if="isPending" />
                    </div>
                </div>
            </div>

            <!-- Sidebar -->
            <div class="lg:col-span-1">
                <div
                    class="sticky top-8 rounded-xl border border-slate-200 bg-white px-3 py-6 md:px-6">
                    <h3 class="text-xl font-semibold text-gray-900">
                        <template v-if="location?.isReservable">
                            {{ $t('pages.locations.sections.reservations.title') }}
                        </template>
                        <template v-else>
                            {{ $t('domains.openings.name', 2) }}
                        </template>
                    </h3>

                    <div class="my-6">
                        <div class="space-y-6" v-if="location">
                            <CalendarControls v-model:date="currentWeek" />
                            <OpeningsTable
                                :opening-times="openingTimes"
                                :current-week="currentWeek"
                                :loading="openingTimesIsPending">
                            </OpeningsTable>
                        </div>
                        <OpeningsTableSkeleton v-else-if="isPending" />
                    </div>

                    <!-- Action Button or No Reservation Needed -->
                    <template v-if="location?.isReservable">
                        <Button
                            class="w-full"
                            @click="showReservationDialog = true"
                            v-if="profileId">
                            {{ $t('pages.locations.sections.reservations.create') }}
                            <FontAwesomeIcon :icon="faArrowRight" />
                        </Button>
                        <Button class="w-full" severity="contrast" @click="onLoginClick" v-else>
                            {{ $t('pages.locations.sections.reservations.login') }}
                            <FontAwesomeIcon :icon="faArrowRight" />
                        </Button>
                    </template>
                    <template v-else-if="location && !location.isReservable">
                        <div class="text-center">
                            {{ $t('pages.locations.sections.reservations.notNeeded') }}
                        </div>
                    </template>
                </div>
            </div>
        </div>

        <Teleport to="body">
            <!-- Reservation Builder Dialog -->
            <ReservationBuilderDialog
                v-if="location && openingTimes"
                v-model:date="currentWeek"
                v-model:visible="showReservationDialog"
                :openings="openingTimes"
                :location="location">
            </ReservationBuilderDialog>

            <!-- Report Location Dialog -->
            <ConfirmDialog
                v-model:visible="showReportDialog"
                title="Locatie melden"
                confirm-label="Melden"
                cancel-label="Annuleren"
                destructive
                :loading="isCreatingReport"
                @click:confirm="onConfirmReport"
                @click:cancel="onCancelReport">
                <template #content>
                    <div class="space-y-3">
                        <p class="text-gray-600">
                            Waarom wil je deze locatie melden? Geef een duidelijke reden op.
                        </p>
                        <Textarea
                            v-model="reportReason"
                            rows="5"
                            placeholder="Bijvoorbeeld: onjuiste informatie, ongepaste inhoud, etc."
                            class="w-full"
                            :disabled="isCreatingReport">
                        </Textarea>
                    </div>
                </template>
            </ConfirmDialog>
        </Teleport>
    </PublicContent>
</template>
