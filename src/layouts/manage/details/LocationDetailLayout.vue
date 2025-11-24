<script setup lang="ts">
import LocationStateCallout from '@/components/features/location/LocationStateCallout.vue';
import TabNavigation, { type TabItem } from '@/components/shared/molecules/TabNavigation.vue';
import DashboardContent from '@/layouts/manage/DashboardContent.vue';
import DashboardLoading from '@/layouts/manage/DashboardLoading.vue';
import DashboardNotFound from '@/layouts/manage/DashboardNotFound.vue';
import DashboardPageHeader from '@/layouts/manage/DashboardPageHeader.vue';
import PageHeaderButton from '@/layouts/manage/PageHeaderButton.vue';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import { faCalendar, faList, faUsers, faUsersGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';
import { useReadLocation } from '@/composables/data/useLocations';
import { LocationState } from '@/domain/location';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    locationId: string;
    profile: Profile;
}>();

const tabs = computed<TabItem[]>(() => [
    {
        value: 'openings',
        label: 'Openingstijden',
        icon: faCalendar,
        route: {
            name: 'dashboard.locations.detail.openings',
            params: { locationId: props.locationId },
        },
    },
    {
        value: 'reservations',
        label: 'Reservaties',
        icon: faUsers,
        route: {
            name: 'dashboard.locations.detail.reservations',
            params: { locationId: props.locationId },
        },
    },
    {
        value: 'info',
        label: 'Informatie',
        icon: faList,
        route: {
            name: 'dashboard.locations.detail.info',
            params: { locationId: props.locationId },
        },
    },
    {
        value: 'access',
        label: 'Toegangsbeheer',
        align: 'right',
        icon: faUsersGear,
        route: {
            name: 'dashboard.locations.detail.members',
            params: { locationId: props.locationId },
        },
    },
]);

const {
    data: location,
    isLoading,
    error,
} = useReadLocation(
    computed(() => +props.locationId),
    {
        includes: ['authority'],
    },
);
</script>

<template>
    <DashboardContent>
        <!-- Loading State -->
        <DashboardLoading v-if="isLoading" />

        <!-- Not Found State -->
        <DashboardNotFound
            v-else-if="!location || error"
            title="Locatie Niet Gevonden"
            message="De locatie die je zoekt bestaat niet of je hebt geen toegang.">
        </DashboardNotFound>

        <!-- Content -->
        <template v-else>
            <!-- Message -->
            <LocationStateCallout
                v-if="location.state !== LocationState.Approved"
                :state="location.state"
                :rejected-reason="location.rejectedReason">
            </LocationStateCallout>

            <!-- Header -->
            <DashboardPageHeader
                :title="location.name"
                :subtitle="location.excerpt?.nl || undefined">
                <template #actions>
                    <RouterLink :to="{ name: 'locations.detail', params: { locationId } }">
                        <PageHeaderButton severity="secondary" label="Bekijken">
                            <FontAwesomeIcon :icon="faEye" />
                        </PageHeaderButton>
                    </RouterLink>
                </template>
            </DashboardPageHeader>

            <!-- Tabs -->
            <TabNavigation :tabs="tabs" />

            <!-- Page Content -->
            <div class="tab-content">
                <RouterView v-slot="{ Component }" :location="location" :profile="profile">
                    <Transition name="fade" mode="out-in">
                        <component :is="Component" />
                    </Transition>
                </RouterView>
            </div>
        </template>
    </DashboardContent>
</template>
