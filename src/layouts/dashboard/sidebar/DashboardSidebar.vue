<script setup lang="ts">
import ProfileAvatar from '@/components/features/profile/avatar/ProfileAvatar.vue';
import Logo from '@/components/shared/atoms/Logo.vue';
import {
    faBuilding,
    faChartLine,
    faChartSimple,
    faCity,
    faExclamationTriangle,
    faList,
    faMapLocationDot,
    faPlus,
    faSignOut,
    faTimes,
    faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAdminCounts } from '@/composables/data/useAdmin';
import { useAuthLogout } from '@/composables/data/useAuth';
import { abbreviateCount } from '@/utils/formatUtils';
import DashboardSidebarLink from './DashboardSidebarLink.vue';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    profile: Profile;
}>();

const visible = defineModel<boolean>('visible', { default: false });

const router = useRouter();

const { mutateAsync: logout } = useAuthLogout();

const { data: counts, isLoading: isLoadingCounts } = useAdminCounts({
    enabled: computed(() => props.profile.isAdmin),
});

const institutionCount = computed(() =>
    counts.value && !isLoadingCounts.value
        ? abbreviateCount(counts.value.institutionCount)
        : undefined,
);

const authorityCount = computed(() =>
    counts.value && !isLoadingCounts.value
        ? abbreviateCount(counts.value.authorityCount)
        : undefined,
);

const locationCount = computed(() =>
    counts.value && !isLoadingCounts.value
        ? abbreviateCount(counts.value.locationCount)
        : undefined,
);

const pendingLocationCount = computed(() => counts.value?.pendingLocationCount);

const profileCount = computed(() =>
    counts.value && !isLoadingCounts.value ? abbreviateCount(counts.value.profileCount) : undefined,
);

async function onLogoutClick(): Promise<void> {
    await router.push({ name: 'auth' });
    logout();
}

function onNavigated() {
    visible.value = false;
}

function onCloseMenu() {
    visible.value = false;
}
</script>

<template>
    <div class="sidebar" data-testid="dashboard-sidebar">
        <!-- Logo and Close Button Section -->
        <div class="sidebar-header">
            <RouterLink :to="{ name: 'locations' }" data-testid="logo-link">
                <Logo variant="dark" />
            </RouterLink>
            <button
                class="sidebar-close-btn"
                @click="onCloseMenu"
                aria-label="Close menu"
                data-testid="sidebar-close">
                <FontAwesomeIcon :icon="faTimes" />
            </button>
        </div>

        <!-- Navigation Sections -->
        <div class="sidebar-items">
            <!-- Locaties Section -->
            <div class="sidebar-section">
                <h4>
                    <FontAwesomeIcon class="leading-icon" :icon="faMapLocationDot" />
                    <span>Locaties</span>
                </h4>
                <DashboardSidebarLink
                    :icon="faList"
                    label="Mijn Locaties"
                    :to="{
                        name: 'dashboard.profiles.detail.locations',
                        params: { profileId: profile.id },
                    }"
                    @navigated="onNavigated">
                </DashboardSidebarLink>
                <DashboardSidebarLink
                    :icon="faPlus"
                    label="Nieuwe Locatie"
                    :to="{ name: 'locations.submit' }"
                    @navigated="onNavigated">
                </DashboardSidebarLink>
            </div>

            <!-- Autoriteiten Section -->
            <div class="sidebar-section">
                <h4>
                    <FontAwesomeIcon class="leading-icon" :icon="faBuilding" />
                    <span>Autoriteiten</span>
                </h4>
                <DashboardSidebarLink
                    :icon="faList"
                    label="Mijn Autoriteiten"
                    :to="{
                        name: 'dashboard.profiles.detail.authorities',
                        params: { profileId: profile.id },
                    }"
                    @navigated="onNavigated">
                </DashboardSidebarLink>
                <DashboardSidebarLink
                    v-if="profile.isAdmin"
                    :icon="faPlus"
                    label="Nieuwe Autoriteit"
                    :to="{ name: 'dashboard.authorities.create' }"
                    @navigated="onNavigated">
                </DashboardSidebarLink>
            </div>

            <!-- Instituties Section -->
            <div class="sidebar-section">
                <h4>
                    <FontAwesomeIcon class="leading-icon" :icon="faCity" />
                    <span>Instituties</span>
                </h4>
                <DashboardSidebarLink
                    :icon="faList"
                    label="Mijn Instituties"
                    :to="{
                        name: 'dashboard.profiles.detail.institutions',
                        params: { profileId: profile.id },
                    }"
                    @navigated="onNavigated">
                </DashboardSidebarLink>
            </div>

            <!-- Systeem Section (Admin only) -->
            <div v-if="profile.isAdmin" class="sidebar-section">
                <h4>
                    <FontAwesomeIcon class="leading-icon" :icon="faChartLine" />
                    <span>Systeem</span>
                </h4>
                <DashboardSidebarLink
                    :icon="faChartSimple"
                    label="Statistieken"
                    :to="{ name: 'dashboard.statistics' }"
                    @navigated="onNavigated">
                </DashboardSidebarLink>
                <DashboardSidebarLink
                    :icon="faCity"
                    label="Instituties"
                    :count="institutionCount"
                    :to="{ name: 'dashboard.institutions.index' }"
                    @navigated="onNavigated">
                </DashboardSidebarLink>
                <DashboardSidebarLink
                    :icon="faBuilding"
                    label="Autoriteiten"
                    :count="authorityCount"
                    :to="{ name: 'dashboard.authorities.index' }"
                    @navigated="onNavigated">
                </DashboardSidebarLink>
                <DashboardSidebarLink
                    :icon="faMapLocationDot"
                    label="Locaties"
                    :count="locationCount"
                    :pending-count="pendingLocationCount"
                    :to="{ name: 'dashboard.locations.index' }"
                    @navigated="onNavigated">
                </DashboardSidebarLink>
                <DashboardSidebarLink
                    :icon="faUsers"
                    label="Profielen"
                    :count="profileCount"
                    :to="{ name: 'dashboard.profiles.index' }"
                    @navigated="onNavigated">
                </DashboardSidebarLink>
                <DashboardSidebarLink
                    :icon="faExclamationTriangle"
                    label="Meldingen"
                    :to="{ name: 'dashboard.reports.index' }"
                    @navigated="onNavigated">
                </DashboardSidebarLink>
            </div>
        </div>

        <div class="sidebar-profile">
            <RouterLink
                :to="{
                    name: 'dashboard.profiles.detail.overview',
                    params: { profileId: profile.id },
                }"
                class="sidebar-link"
                @click="onNavigated"
                data-testid="profile-link">
                <ProfileAvatar :profile="profile" class="h-10 w-10" />
                <div class="flex-1 space-y-1 leading-tight">
                    <div class="text-sm font-semibold text-white">
                        {{ profile.firstName }}
                    </div>
                    <div class="text-xs text-slate-400">Welkom terug!</div>
                </div>
            </RouterLink>

            <button
                class="sidebar-link logout-btn"
                data-testid="logout-button"
                @click="onLogoutClick">
                <FontAwesomeIcon :icon="faSignOut" />
                <span>Uitloggen</span>
            </button>
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.sidebar {
    @apply flex flex-col gap-5 pt-3 pb-5;
    @apply bg-slate-900 text-slate-300;
    @apply max-h-screen overflow-y-auto md:overflow-y-visible;

    .sidebar-header {
        @apply flex items-center justify-between px-3;
        @apply md:justify-center md:px-3;

        .sidebar-close-btn {
            @apply flex h-10 w-10 items-center justify-center;
            @apply rounded-md bg-slate-800 text-xl text-white;
            @apply transition-colors hover:bg-slate-700;
            @apply md:hidden;
        }
    }

    .sidebar-items {
        @apply flex-1 space-y-6 px-5 md:pt-4;

        .sidebar-section {
            @apply space-y-1.5;

            &:not(:last-child) {
                @apply border-b border-slate-700 pb-6;
            }

            h4 {
                @apply mb-3 flex items-center text-[15px] font-bold text-white;
            }

            .leading-icon {
                @apply text-primary-300 mr-2 flex-shrink-0;
                width: 1rem;
                text-align: center;
            }
        }
    }

    .sidebar-profile {
        @apply space-y-3 border-t border-slate-700 p-4 pb-0;

        .sidebar-link {
            @apply flex w-full items-center;
            @apply cursor-pointer transition-colors duration-200 hover:text-slate-300;
            @apply gap-3 rounded-lg p-2 hover:bg-slate-800;

            &.logout-btn {
                @apply w-full cursor-pointer;
            }
        }
    }
}
</style>
