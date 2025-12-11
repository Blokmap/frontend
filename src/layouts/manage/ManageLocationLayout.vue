<script lang="ts" setup>
import InstitutionBreadcrumb from '@/components/features/institution/InstitutionBreadcrumb.vue';
import LayoutContainer from '@/layouts/LayoutContainer.vue';
import LayoutSidebar from '@/layouts/sidebar/LayoutSidebar.vue';
import LayoutSidebarItem from '@/layouts/sidebar/LayoutSidebarItem.vue';
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
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useReadLocation } from '@/composables/data/useLocations';
import { useReadLocationMemberPermissions } from '@/composables/data/useMembers';
import { getLocationImageUrl } from '@/domain/location';
import LayoutSidebarSection from '../sidebar/LayoutSidebarSection.vue';
import ManagementLoader from './ManagementLoader.vue';
import ManagementLoaderError from './ManagementLoaderError.vue';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    authProfile: Profile;
    locationId: string;
}>();

const route = useRoute();

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

const {
    data: permissions,
    isLoading: isLoadingPermissions,
    error: permissionsError,
} = useReadLocationMemberPermissions(locationId, profileId);

const isLoading = computed<boolean>(() => {
    return isLoadingLocation.value || isLoadingPermissions.value;
});

const locationImageUrl = computed<string>(() => {
    return getLocationImageUrl(location.value);
});
</script>

<template>
    <LayoutContainer :loading="isLoading">
        <template #sidebar>
            <LayoutSidebar
                :title="location?.name ?? 'Locatie'"
                :logo="locationImageUrl"
                :loading="isLoading">
                <template #header>
                    <InstitutionBreadcrumb
                        :institution="location?.institution"
                        :authority="location?.authority"
                        :loading="isLoading"
                        editable>
                    </InstitutionBreadcrumb>
                </template>

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
                    <LayoutSidebarItem
                        v-if="isLoading || location?.isReservable"
                        :loading="isLoading"
                        :to="{ name: 'manage.location.reservations', params: { locationId } }"
                        :active="route.name === 'manage.location.reservations'">
                        <template #img>
                            <FontAwesomeIcon :icon="faCalendarDays" />
                        </template>
                        <template #text>Reservaties</template>
                    </LayoutSidebarItem>

                    <LayoutSidebarItem
                        v-if="isLoading || location?.isReservable"
                        :loading="isLoading"
                        :to="{ name: 'manage.location.scan', params: { locationId } }"
                        :active="route.name === 'manage.location.scan'">
                        <template #img>
                            <FontAwesomeIcon :icon="faQrcode" />
                        </template>
                        <template #text>Scanner</template>
                    </LayoutSidebarItem>
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
            <ManagementLoader v-if="isLoading" />

            <RouterView
                v-else-if="location"
                v-slot="{ Component, route }"
                :location="location"
                :permissions="permissions"
                :auth-profile="authProfile">
                <Transition name="fade-slide-up" mode="out-in">
                    <component :is="Component" :key="route.path" />
                </Transition>
            </RouterView>

            <ManagementLoaderError v-else :errors="[locationError, permissionsError]" />
        </template>
    </LayoutContainer>
</template>
