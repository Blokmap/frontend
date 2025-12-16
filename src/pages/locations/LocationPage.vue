<script lang="ts" setup>
import Button from 'primevue/button';
import Skeleton from 'primevue/skeleton';
import Textarea from 'primevue/textarea';
import LocationAddress from '@/components/features/location/details/LocationAddress.vue';
import LocationFeatures from '@/components/features/location/details/LocationFeatures.vue';
import LocationMap from '@/components/features/map/LocationMap.vue';
import OpeningsTable from '@/components/features/openings/OpeningsTable.vue';
import ReservationBuilderDialog from '@/components/features/reservation/builder/ReservationBuilderDialog.vue';
import ConfirmDialog from '@/components/shared/molecules/ConfirmDialog.vue';
import CalendarControls from '@/components/shared/molecules/calendar/CalendarControls.vue';
import EditorOuput from '@/components/shared/molecules/editor/EditorOuput.vue';
import Gallery from '@/components/shared/molecules/image/Gallery.vue';
import PageContent from '@/pages/PageContent.vue';
import PageHeaderButton from '@/pages/PageHeaderButton.vue';
import { faArrowRight, faBullhorn, faEdit, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useElementVisibility } from '@vueuse/core';
import { computed, ref, watchEffect } from 'vue';
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
import { formatLocationAddress } from '@/domain/location';
import type { OpeningTimeFilter } from '@/domain/openings';

const openingsSidebarRef = ref<HTMLElement>();

const isOpeningsSidebarVisible = useElementVisibility(openingsSidebarRef);
const showMobileBanner = computed(() => !isOpeningsSidebarVisible.value);

const props = defineProps<{ locationId: string }>();

const { locale } = useI18n();
const { setPageTitle } = usePageTitleStore();

const router = useRouter();
const route = useRoute();

const currentWeek = useRouteDate({ paramName: 'week' });

const locationId = computed<number>(() => +props.locationId);

const { profileId, data: profile } = useAuthProfile();

const { data: location, isPending } = useReadLocation(locationId, {
    includes: ['createdBy', 'description'],
});

const openingTimesFilter = computed<OpeningTimeFilter>(() => {
    return {
        inWeekOf: currentWeek.value,
    };
});

const { data: openingTimes, isFetching: openingTimesIsFetching } = useReadOpeningTimes(
    locationId,
    openingTimesFilter,
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

watchEffect(() => {
    if (location.value) {
        setPageTitle(location.value.name);
    }
});

const showReportDialog = ref<boolean>(false);
const reportReason = ref<string>('');

const { mutateAsync: createReport, isPending: isCreatingReport } = useCreateLocationReport({
    onSuccess: () => {
        showReportDialog.value = false;
        reportReason.value = '';
    },
});

const onConfirmReport = (): void => {
    if (!reportReason.value.trim()) {
        return;
    }

    createReport({
        locationId: +locationId,
        reason: reportReason.value,
    });
};

const onReportClick = (): void => {
    showReportDialog.value = true;
    reportReason.value = '';
};

const onCancelReport = (): void => {
    showReportDialog.value = false;
    reportReason.value = '';
};

const onLoginClick = (): void => {
    const redirectRoute = router.resolve({
        name: 'locations.detail',
        params: { locationId: locationId.value },
        hash: '#reservations',
    });

    pushRedirectUrl(redirectRoute.fullPath);

    router.push({ name: 'auth' });
};

const scrollToOpenings = (): void => {
    openingsSidebarRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};
</script>

<template>
    <PageContent class="location-page">
        <!-- Header -->
        <div v-if="!isPending && location" class="location-page__header">
            <div class="my-4 space-y-1">
                <h1 class="location-page__title">{{ location.name }}</h1>
                <p class="location-page__subtitle">{{ formatLocationAddress(location) }}</p>
            </div>

            <div class="location-page__actions">
                <template v-if="profile?.isAdmin">
                    <RouterLink
                        v-if="location.isReservable"
                        class="hidden md:block"
                        :to="{
                            name: 'manage.location.reservations',
                            params: { locationId: location.id },
                        }">
                        <PageHeaderButton
                            severity="contrast"
                            :label="$t('domains.reservations.name', 2)">
                            <FontAwesomeIcon :icon="faUsers" />
                        </PageHeaderButton>
                    </RouterLink>

                    <RouterLink
                        class="hidden md:block"
                        :to="{ name: 'manage.location.info', params: { locationId: location.id } }">
                        <PageHeaderButton severity="secondary" :label="$t('general.actions.edit')">
                            <FontAwesomeIcon :icon="faEdit" />
                        </PageHeaderButton>
                    </RouterLink>
                </template>

                <PageHeaderButton v-if="profileId" severity="contrast" text @click="onReportClick">
                    <FontAwesomeIcon :icon="faBullhorn" />
                </PageHeaderButton>
            </div>
        </div>

        <div v-else-if="isPending" class="location-page__header">
            <h1 class="location-page__title" data-testid="location-name">
                <Skeleton height="36px" width="400px" />
            </h1>
            <div class="location-page__actions">
                <Skeleton height="36px" width="120px" />
            </div>
        </div>

        <!-- Gallery -->
        <Transition name="fade-slide-up" appear>
            <div class="location-page__gallery">
                <Gallery
                    :images="location?.images ?? []"
                    :placeholder="placeholder"
                    :loading="isPending">
                </Gallery>
            </div>
        </Transition>

        <div class="location-page__grid">
            <!-- Main Content -->
            <div class="location-page__main">
                <Transition name="stagger-fade" appear>
                    <div class="max-w-[850px]">
                        <h2
                            v-if="!isPending && location"
                            class="location-page__section-title !mb-5">
                            {{ location.excerpt[locale] }}
                        </h2>
                        <Skeleton v-else height="28px" width="400px" class="mb-5" />

                        <EditorOuput
                            v-if="location?.description"
                            :data="location.description[locale]"
                            :loading="isPending">
                        </EditorOuput>
                    </div>
                </Transition>

                <div class="location-page__divider"></div>

                <Transition name="stagger-fade" appear>
                    <div>
                        <h2 class="location-page__section-title">
                            {{ $t('pages.locations.sections.features.title') }}
                        </h2>
                        <LocationFeatures :location="location" :loading="isPending" />
                    </div>
                </Transition>

                <div class="location-page__divider"></div>

                <Transition name="stagger-fade" appear>
                    <div v-if="location">
                        <h2 class="location-page__section-title">
                            {{ $t('pages.locations.sections.geolocation.title') }}
                        </h2>

                        <LocationAddress :location="location" :loading="isPending" />

                        <div class="location-page__map">
                            <LocationMap
                                :center="[location.longitude, location.latitude]"
                                :zoom="17"
                                :interactive="false"
                                :geo-location-control="false"
                                :loading="isPending">
                            </LocationMap>
                        </div>
                    </div>
                </Transition>
            </div>

            <!-- Sidebar -->
            <Transition name="stagger-fade" appear>
                <div ref="openingsSidebarRef" class="location-page__sidebar">
                    <h3 v-if="!isPending && location" class="location-page__sidebar-title">
                        <template v-if="location.isReservable">
                            {{ $t('pages.locations.sections.reservations.title') }}
                        </template>
                        <template v-else>
                            {{ $t('domains.openings.name', 2) }}
                        </template>
                    </h3>

                    <Skeleton v-else height="24px" width="150px" class="mb-6" />

                    <div class="space-y-4">
                        <CalendarControls v-model:date="currentWeek" />
                        <OpeningsTable
                            :opening-times="openingTimes"
                            :current-week="currentWeek"
                            :loading="openingTimesIsFetching">
                        </OpeningsTable>
                    </div>

                    <div v-if="!isPending && location?.isReservable" class="location-page__cta">
                        <Button
                            v-if="profileId"
                            class="w-full"
                            @click="showReservationDialog = true">
                            {{ $t('pages.locations.sections.reservations.create') }}
                            <FontAwesomeIcon :icon="faArrowRight" />
                        </Button>
                        <Button v-else class="w-full" severity="secondary" @click="onLoginClick">
                            {{ $t('pages.locations.sections.reservations.login') }}
                            <FontAwesomeIcon :icon="faArrowRight" />
                        </Button>
                    </div>
                    <div
                        v-else-if="!isPending && location && !location.isReservable"
                        class="location-page__no-reservation">
                        {{ $t('pages.locations.sections.reservations.notNeeded') }}
                    </div>
                </div>
            </Transition>
        </div>

        <!-- Mobile Sticky Banner -->
        <Transition name="fade-slide-up">
            <div
                v-if="!isPending && location && showMobileBanner"
                class="location-page__mobile-banner"
                @click="scrollToOpenings">
                <span>
                    <template v-if="location.isReservable">
                        {{ $t('pages.locations.sections.reservations.title') }}
                    </template>
                    <template v-else>
                        {{ $t('domains.openings.name', 2) }}
                    </template>
                </span>
                <FontAwesomeIcon :icon="faArrowRight" />
            </div>
        </Transition>

        <Teleport to="body">
            <!-- Reservation Builder Dialog -->
            <ReservationBuilderDialog
                v-if="location && openingTimes"
                v-model:date="currentWeek"
                v-model:visible="showReservationDialog"
                :openings="openingTimes"
                :openings-loading="openingTimesIsFetching"
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
    </PageContent>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.location-page {
    @apply max-w-[1280px] space-y-6;

    .location-page__header {
        @apply flex items-center justify-between gap-3;
    }

    .location-page__title {
        @apply text-3xl font-extrabold text-gray-900;
    }

    .location-page__subtitle {
        @apply text-slate-500;
    }

    .location-page__actions {
        @apply flex space-x-3;
    }

    .location-page__gallery {
        @apply h-[250px] overflow-hidden rounded-2xl md:h-[500px];
    }

    .location-page__grid {
        @apply mt-8 grid items-start gap-8 lg:grid-cols-3;
    }

    .location-page__main {
        @apply lg:col-span-2;
    }

    .location-page__divider {
        @apply my-8 h-[2px] bg-slate-200;
    }

    .location-page__section-title {
        @apply mt-0 mb-8 text-2xl font-semibold text-gray-900;
    }

    .location-page__map {
        @apply mt-8 h-[400px] overflow-hidden rounded-xl shadow-sm;
    }

    .location-page__sidebar {
        @apply sticky top-8 rounded-xl bg-white p-6 pt-6 shadow-md lg:col-span-1;
    }

    .location-page__sidebar-title {
        @apply mb-6 text-2xl font-semibold text-gray-900;
    }

    .location-page__cta {
        @apply mt-6 w-full;
    }

    .location-page__no-reservation {
        @apply mt-6 text-center text-sm text-slate-600;
    }

    .location-page__mobile-banner {
        @apply fixed bottom-3 left-1/2 z-50 -translate-x-1/2 rounded-full bg-slate-50 px-3 py-2 text-sm shadow-md lg:hidden;
    }
}
</style>
