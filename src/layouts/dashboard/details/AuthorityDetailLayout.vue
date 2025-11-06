<script setup lang="ts">
import TabNavigation, { type TabItem } from '@/components/shared/molecules/TabNavigation.vue';
import DashboardContent from '@/layouts/dashboard/DashboardContent.vue';
import DashboardLoading from '@/layouts/dashboard/DashboardLoading.vue';
import DashboardNotFound from '@/layouts/dashboard/DashboardNotFound.vue';
import DashboardDetailHeader from '@/layouts/dashboard/details/DashboardDetailHeader.vue';
import {
    faBuilding,
    faList,
    faMapLocationDot,
    faUsersGear,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';
import { useReadAuthority } from '@/composables/data/useAuthorities';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    authorityId: string;
    profile: Profile;
}>();

const { data: authority, isLoading, error } = useReadAuthority(computed(() => +props.authorityId));

const tabs = computed<TabItem[]>(() => [
    {
        value: 'overview',
        label: 'Overzicht',
        icon: faList,
        route: {
            name: 'dashboard.authorities.detail.overview',
            params: { authorityId: props.authorityId },
        },
    },
    {
        value: 'locations',
        label: 'Locaties',
        icon: faMapLocationDot,
        route: {
            name: 'dashboard.authorities.detail.locations',
            params: { authorityId: props.authorityId },
        },
    },
    {
        value: 'access',
        label: 'Toegangsbeheer',
        align: 'right',
        icon: faUsersGear,
        route: {
            name: 'dashboard.authorities.detail.members',
            params: { authorityId: props.authorityId },
        },
    },
]);
</script>

<template>
    <DashboardContent>
        <!-- Loading State -->
        <DashboardLoading v-if="isLoading" />

        <!-- Not Found State -->
        <DashboardNotFound
            v-else-if="!authority || error"
            title="Autoriteit Niet Gevonden"
            message="De autoriteit die je zoekt bestaat niet of je hebt geen toegang.">
        </DashboardNotFound>

        <!-- Content -->
        <template v-else>
            <!-- Authority Header -->
            <DashboardDetailHeader
                :title="authority?.name ?? undefined"
                :secondary="authority?.description ?? undefined">
                <template #avatar>
                    <div class="logo-placeholder">
                        <FontAwesomeIcon :icon="faBuilding" class="text-4xl text-gray-400" />
                    </div>
                </template>
            </DashboardDetailHeader>

            <!-- Tabs -->
            <TabNavigation :tabs="tabs" />

            <!-- Page Content -->
            <div class="tab-content">
                <RouterView :authority="authority" :profile="profile"></RouterView>
            </div>
        </template>
    </DashboardContent>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.logo-placeholder {
    @apply flex h-full w-full items-center justify-center;
    @apply rounded-lg border border-gray-200 bg-gray-100;
}
</style>
