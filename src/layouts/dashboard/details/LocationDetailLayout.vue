<script setup lang="ts">
import TabNavigation, { type TabItem } from '@/components/shared/molecules/TabNavigation.vue';
import DashboardContent from '@/layouts/dashboard/DashboardContent.vue';
import DashboardLoading from '@/layouts/dashboard/DashboardLoading.vue';
import DashboardNotFound from '@/layouts/dashboard/DashboardNotFound.vue';
import DashboardPageHeader from '@/layouts/dashboard/DashboardPageHeader.vue';
import PageHeaderButton from '@/layouts/dashboard/PageHeaderButton.vue';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import { faCalendar, faList, faUsers, faUsersGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';
import { useReadLocation } from '@/composables/data/useLocations';
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
            name: 'dashboard.locations.detail.access',
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
        includes: ['images'],
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
                <RouterView :location="location" />
            </div>
        </template>
    </DashboardContent>
</template>
