<script setup lang="ts">
import ProfileAvatar from '@/components/features/profile/avatar/ProfileAvatar.vue';
import Logo from '@/components/shared/atoms/Logo.vue';
import {
    faBuilding,
    faChartLine,
    faChartSimple,
    faChevronLeft,
    faChevronRight,
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
const collapsed = defineModel<boolean>('collapsed', { default: false });

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

function toggleCollapsed() {
    collapsed.value = !collapsed.value;
}
</script>

<template>
    <div
        class="sidebar"
        :class="{ 'sidebar--collapsed': collapsed }"
        data-testid="dashboard-sidebar">
        <!-- Logo and Close Button Section -->
        <div class="sidebar__header">
            <RouterLink :to="{ name: 'locations' }" class="sidebar__logo" data-testid="logo-link">
                <Logo variant="dark" />
            </RouterLink>
            <button
                class="sidebar__close-btn"
                @click="onCloseMenu"
                aria-label="Close menu"
                data-testid="sidebar-close">
                <FontAwesomeIcon :icon="faTimes" />
            </button>
            <button
                class="sidebar__collapse-btn"
                @click="toggleCollapsed"
                :aria-label="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
                data-testid="sidebar-collapse">
                <FontAwesomeIcon :icon="collapsed ? faChevronRight : faChevronLeft" />
            </button>
        </div>

        <!-- Navigation Sections -->
        <div class="sidebar__items">
            <!-- Locaties Section -->
            <div class="sidebar__section">
                <h4 class="sidebar__section-title">
                    <FontAwesomeIcon class="sidebar__section-icon" :icon="faMapLocationDot" />
                    <span class="sidebar__section-text">Locaties</span>
                </h4>
                <DashboardSidebarLink
                    :icon="faList"
                    label="Mijn Locaties"
                    :collapsed="collapsed"
                    :to="{
                        name: 'dashboard.profiles.detail.locations',
                        params: { profileId: profile.id },
                    }"
                    @navigated="onNavigated">
                </DashboardSidebarLink>
                <DashboardSidebarLink
                    :icon="faPlus"
                    label="Nieuwe Locatie"
                    :collapsed="collapsed"
                    :to="{ name: 'locations.submit' }"
                    @navigated="onNavigated">
                </DashboardSidebarLink>
            </div>

            <!-- Autoriteiten Section -->
            <div class="sidebar__section">
                <h4 class="sidebar__section-title">
                    <FontAwesomeIcon class="sidebar__section-icon" :icon="faBuilding" />
                    <span class="sidebar__section-text">Autoriteiten</span>
                </h4>
                <DashboardSidebarLink
                    :icon="faList"
                    label="Mijn Autoriteiten"
                    :collapsed="collapsed"
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
                    :collapsed="collapsed"
                    :to="{ name: 'dashboard.authorities.create' }"
                    @navigated="onNavigated">
                </DashboardSidebarLink>
            </div>

            <!-- Instituties Section -->
            <div class="sidebar__section">
                <h4 class="sidebar__section-title">
                    <FontAwesomeIcon class="sidebar__section-icon" :icon="faCity" />
                    <span class="sidebar__section-text">Instituties</span>
                </h4>
                <DashboardSidebarLink
                    :icon="faList"
                    label="Mijn Instituties"
                    :collapsed="collapsed"
                    :to="{
                        name: 'dashboard.profiles.detail.institutions',
                        params: { profileId: profile.id },
                    }"
                    @navigated="onNavigated">
                </DashboardSidebarLink>
            </div>

            <!-- Systeem Section (Admin only) -->
            <div v-if="profile.isAdmin" class="sidebar__section">
                <h4 class="sidebar__section-title">
                    <FontAwesomeIcon class="sidebar__section-icon" :icon="faChartLine" />
                    <span class="sidebar__section-text">Systeem</span>
                </h4>
                <DashboardSidebarLink
                    :icon="faChartSimple"
                    label="Statistieken"
                    :collapsed="collapsed"
                    :to="{ name: 'dashboard.statistics' }"
                    @navigated="onNavigated">
                </DashboardSidebarLink>
                <DashboardSidebarLink
                    :icon="faCity"
                    label="Instituties"
                    :count="institutionCount"
                    :collapsed="collapsed"
                    :to="{ name: 'dashboard.institutions.index' }"
                    @navigated="onNavigated">
                </DashboardSidebarLink>
                <DashboardSidebarLink
                    :icon="faBuilding"
                    label="Autoriteiten"
                    :count="authorityCount"
                    :collapsed="collapsed"
                    :to="{ name: 'dashboard.authorities.index' }"
                    @navigated="onNavigated">
                </DashboardSidebarLink>
                <DashboardSidebarLink
                    :icon="faMapLocationDot"
                    label="Locaties"
                    :count="locationCount"
                    :pending-count="pendingLocationCount"
                    :collapsed="collapsed"
                    :to="{ name: 'dashboard.locations.index' }"
                    @navigated="onNavigated">
                </DashboardSidebarLink>
                <DashboardSidebarLink
                    :icon="faUsers"
                    label="Profielen"
                    :count="profileCount"
                    :collapsed="collapsed"
                    :to="{ name: 'dashboard.profiles.index' }"
                    @navigated="onNavigated">
                </DashboardSidebarLink>
                <DashboardSidebarLink
                    :icon="faExclamationTriangle"
                    label="Meldingen"
                    :collapsed="collapsed"
                    :to="{ name: 'dashboard.reports.index' }"
                    @navigated="onNavigated">
                </DashboardSidebarLink>
            </div>
        </div>

        <div class="sidebar__profile">
            <RouterLink
                :to="{
                    name: 'dashboard.profiles.detail.overview',
                    params: { profileId: profile.id },
                }"
                class="sidebar__profile-link"
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
                class="sidebar__profile-link sidebar__profile-link--logout"
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
    @apply max-h-screen overflow-x-hidden overflow-y-auto md:overflow-y-visible;
    @apply transition-all duration-300;
    @apply w-full;
    min-width: 0;
}

.sidebar__header {
    @apply flex items-center justify-between px-3;
    @apply md:relative md:justify-center md:px-3;
}

.sidebar__close-btn {
    @apply flex h-10 w-10 items-center justify-center;
    @apply rounded-md bg-slate-800 text-xl text-white;
    @apply transition-colors hover:bg-slate-700;
    @apply md:hidden;
}

.sidebar__collapse-btn {
    @apply hidden h-8 w-8 items-center justify-center md:flex;
    @apply absolute top-1/2 right-3 -translate-y-1/2;
    @apply rounded-md bg-slate-800 text-sm text-white;
    @apply transition-all duration-300 hover:bg-slate-700;
}

.sidebar__items {
    @apply flex-1 space-y-6 px-5 md:pt-4;
    @apply transition-opacity duration-300;
}

.sidebar__section {
    @apply space-y-1.5;

    &:not(:last-child) {
        @apply border-b border-slate-700 pb-6;
    }
}

.sidebar__section-title {
    @apply mb-3 flex items-center text-[15px] font-bold text-white;
    @apply transition-all duration-300;
}

.sidebar__section-text {
    @apply transition-all duration-300;
    @apply whitespace-nowrap;
}

.sidebar__section-icon {
    @apply text-primary-300 mr-2 flex-shrink-0;
    width: 1rem;
    text-align: center;
}

.sidebar__profile {
    @apply space-y-3 border-t border-slate-700 p-4 pb-0;
    @apply transition-opacity duration-300;
}

.sidebar__profile-link {
    @apply flex w-full items-center;
    @apply cursor-pointer transition-colors duration-200 hover:text-slate-300;
    @apply gap-3 rounded-lg p-2 hover:bg-slate-800;

    > div {
        @apply whitespace-nowrap;
    }

    span {
        @apply whitespace-nowrap;
    }
}

.sidebar__profile-link--logout {
    @apply w-full cursor-pointer;
}

/* Modifier: collapsed */
.sidebar--collapsed {
    .sidebar__header {
        @apply md:px-2;
    }

    .sidebar__logo {
        @apply md:hidden;
    }

    .sidebar__collapse-btn {
        @apply md:relative md:right-auto md:translate-y-0;
    }

    .sidebar__items {
        @apply md:px-2;
    }

    .sidebar__section-title {
        @apply md:justify-center;
    }

    .sidebar__section-text {
        @apply md:hidden;
    }

    .sidebar__section-icon {
        @apply md:mr-0 md:text-lg;
    }

    .sidebar__profile {
        @apply md:p-2;
    }

    .sidebar__profile-link {
        @apply md:flex-col md:gap-1 md:text-center;

        > div {
            @apply md:hidden;
        }

        span {
            @apply md:hidden md:text-xs;
        }
    }
}
</style>
