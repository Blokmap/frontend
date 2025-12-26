<script lang="ts" setup>
import PulsingIndicator from '@/components/atoms/PulsingIndicator.vue';
import LayoutContainer from '@/components/organisms/layouts/LayoutContainer.vue';
import Loader from '@/components/organisms/layouts/Loader.vue';
import LoaderError from '@/components/organisms/layouts/LoaderError.vue';
import LayoutSidebar from '@/components/organisms/layouts/sidebar/LayoutSidebar.vue';
import LayoutSidebarItem from '@/components/organisms/layouts/sidebar/LayoutSidebarItem.vue';
import LayoutSidebarSection from '@/components/organisms/layouts/sidebar/LayoutSidebarSection.vue';
import {
    faCalendarDays,
    faClock,
    faCog,
    faImages,
    faInfoCircle,
    faQrcode,
    faUsers,
    faUserTag,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useReadLocation, useReadLocationReservations } from '@/composables/data/useLocations';
import { useReadLocationMemberPermissions } from '@/composables/data/useMembers';
import { getInstitutionName } from '@/domain/institution';
import { getLocationImageUrl, isLocationCurrentlyOpen } from '@/domain/location';
import { type ReservationFilter } from '@/domain/reservation';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    authProfile: Profile;
    locationId: string;
}>();

const { locale } = useI18n();

const route = useRoute();
const router = useRouter();

const profileId = computed<string>(() => {
    return props.authProfile.id;
});

const locationId = computed<number>(() => {
    return +props.locationId;
});

const {
    data: location,
    isLoading: isLoadingLocation,
    error: locationError,
} = useReadLocation(locationId, {
    includes: ['authority', 'description', 'institution'],
});

const locationIsOpen = computed<boolean>(() => {
    return !!location.value && isLocationCurrentlyOpen(location.value);
});

const enableReservations = computed<boolean>(() => {
    return location.value !== undefined;
});

const reservationFilter = ref<ReservationFilter>({
    day: new Date(),
});

const reservationOptions = {
    enabled: enableReservations,
};

const { data: reservations, isLoading: isLoadingReservations } = useReadLocationReservations(
    locationId,
    reservationFilter,
    reservationOptions,
);

const {
    data: permissions,
    isLoading: isLoadingPermissions,
    error: permissionsError,
} = useReadLocationMemberPermissions(locationId, profileId);

const isLoading = computed<boolean>(() => {
    return isLoadingLocation.value || isLoadingReservations.value || isLoadingPermissions.value;
});

const locationImageUrl = computed<string>(() => {
    return getLocationImageUrl(location.value);
});

const backButtonText = computed<string>(() => {
    if (location.value?.authority) {
        return location.value.authority.name;
    }

    if (location.value?.institution) {
        return getInstitutionName(location.value.institution, locale.value);
    }

    return 'Terug naar dashboard';
});

function goBack(): void {
    if (location.value?.authority) {
        router.push({
            name: 'manage.authority',
            params: { authorityId: location.value.authority.id },
        });
    } else if (location.value?.institution) {
        router.push({
            name: 'manage.institution',
            params: { institutionId: location.value.institution.id },
        });
    } else {
        router.push({ name: 'manage.dashboard' });
    }
}
</script>

<template>
    <LayoutContainer :loading="isLoading">
        <template #sidebar>
            <LayoutSidebar
                :title="location?.name ?? 'Locatie'"
                :logo="locationImageUrl"
                :loading="isLoading"
                show-back-button
                :back-button-text="backButtonText"
                @click:back="goBack">
                <LayoutSidebarSection title="Instellingen">
                    <LayoutSidebarItem
                        :loading="isLoading"
                        :to="{ name: 'manage.location.info', params: { locationId } }"
                        :active="route.name === 'manage.location.info'">
                        <template #img>
                            <FontAwesomeIcon :icon="faInfoCircle" />
                        </template>
                        <template #text>Informatie</template>
                    </LayoutSidebarItem>

                    <LayoutSidebarItem
                        :loading="isLoading"
                        :to="{ name: 'manage.location.images', params: { locationId } }"
                        :active="route.name === 'manage.location.images'">
                        <template #img>
                            <FontAwesomeIcon :icon="faImages" />
                        </template>
                        <template #text>Afbeeldingen</template>
                    </LayoutSidebarItem>

                    <LayoutSidebarItem
                        :loading="isLoading"
                        :to="{ name: 'manage.location.openings', params: { locationId } }"
                        :active="route.name === 'manage.location.openings'">
                        <template #img>
                            <FontAwesomeIcon :icon="faClock" />
                        </template>
                        <template #text>Openingsuren</template>
                    </LayoutSidebarItem>

                    <LayoutSidebarItem
                        :loading="isLoading"
                        :to="{ name: 'manage.location.settings', params: { locationId } }"
                        :active="route.name === 'manage.location.settings'">
                        <template #img>
                            <FontAwesomeIcon :icon="faCog" />
                        </template>
                        <template #text>Instellingen</template>
                    </LayoutSidebarItem>
                </LayoutSidebarSection>

                <LayoutSidebarSection title="Reservaties">
                    <template v-if="isLoading || location?.isReservable">
                        <LayoutSidebarItem
                            :loading="isLoading"
                            :to="{ name: 'manage.location.reservations', params: { locationId } }"
                            :active="route.name === 'manage.location.reservations'">
                            <template #img>
                                <FontAwesomeIcon :icon="faCalendarDays" />
                            </template>
                            <template #text>
                                <div class="flex items-center justify-between gap-2 pr-3">
                                    <span>Reservaties</span>
                                    <PulsingIndicator v-if="locationIsOpen">
                                        {{ reservations?.length ?? 0 }}
                                    </PulsingIndicator>
                                </div>
                            </template>
                        </LayoutSidebarItem>

                        <LayoutSidebarItem
                            :loading="isLoading"
                            :to="{ name: 'manage.location.scan', params: { locationId } }"
                            :active="route.name === 'manage.location.scan'">
                            <template #img>
                                <FontAwesomeIcon :icon="faQrcode" />
                            </template>
                            <template #text>Scanner</template>
                        </LayoutSidebarItem>
                    </template>
                    <template v-else-if="location">
                        <span class="text-sm">
                            Deze locatie werkt niet met reservaties. Je kan dit instellen op
                            <RouterLink
                                class="styled"
                                :to="{
                                    name: 'manage.location.settings',
                                    params: { locationId: location.id },
                                }">
                                deze pagina </RouterLink
                            >.
                        </span>
                    </template>
                </LayoutSidebarSection>

                <LayoutSidebarSection title="Toegangscontrole">
                    <LayoutSidebarItem
                        :loading="isLoading"
                        :to="{ name: 'manage.location.members', params: { locationId } }"
                        :active="route.name === 'manage.location.members'">
                        <template #img>
                            <FontAwesomeIcon :icon="faUsers" />
                        </template>
                        <template #text>Leden</template>
                    </LayoutSidebarItem>
                    <LayoutSidebarItem
                        :loading="isLoading"
                        :to="{ name: 'manage.location.roles', params: { locationId } }"
                        :active="route.name === 'manage.location.roles'">
                        <template #img>
                            <FontAwesomeIcon :icon="faUserTag" />
                        </template>
                        <template #text>Rollen</template>
                    </LayoutSidebarItem>
                </LayoutSidebarSection>
            </LayoutSidebar>
        </template>

        <template #main>
            <Loader v-if="isLoading" />

            <RouterView
                v-else-if="location"
                v-slot="{ Component, route }"
                :location="location"
                :permissions="permissions"
                :auth-profile="authProfile">
                <Transition name="fade-slide-up" mode="out-in" appear>
                    <component :is="Component" :key="route.path" />
                </Transition>
            </RouterView>

            <LoaderError v-else :errors="[locationError, permissionsError]" />
        </template>
    </LayoutContainer>
</template>
