<script setup lang="ts">
import ProfileAvatar from '@/components/features/profile/avatar/ProfileAvatar.vue';
import Logo from '@/components/shared/atoms/Logo.vue';
import {
    faArrowRight,
    faBuilding,
    faChartLine,
    faChartSimple,
    faCity,
    faList,
    faMapLocationDot,
    faPlus,
    faSignOut,
    faTimes,
    faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAdminCounts } from '@/composables/data/useAdmin';
import { useAuthLogout } from '@/composables/data/useAuth';
import { abbreviateCount } from '@/utils/format';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    profile: Profile;
}>();

const visible = defineModel<boolean>('visible', { default: false });

const router = useRouter();
const route = useRoute();

const { mutateAsync: logout } = useAuthLogout();

const { data: counts, isLoading: isLoadingCounts } = useAdminCounts({
    enabled: computed(() => props.profile.isAdmin),
});

async function handleLogoutClick(): Promise<void> {
    await router.push({ name: 'auth' });
    await logout();
}

function isRouteActive(routeName: string): boolean {
    return route.name?.toString().startsWith(routeName) || false;
}

function closeMenu() {
    visible.value = false;
}

function handleNavigate() {
    closeMenu();
}
</script>

<template>
    <div class="sidebar" data-testid="dashboard-sidebar">
        <!-- Logo and Close Button Section -->
        <div class="sidebar-header">
            <RouterLink :to="{ name: 'locations' }" @click="handleNavigate" data-testid="logo-link">
                <Logo :show-subtitle="false" variant="dark" />
            </RouterLink>
            <button
                class="sidebar-close-btn"
                @click="closeMenu"
                aria-label="Close menu"
                data-testid="sidebar-close">
                <FontAwesomeIcon :icon="faTimes" />
            </button>
        </div>

        <!-- Navigation Sections -->
        <div class="sidebar-items">
            <div class="sidebar-section">
                <h4>
                    <FontAwesomeIcon class="leading-icon" :icon="faMapLocationDot" />
                    <span>Locaties</span>
                </h4>
                <RouterLink
                    class="sidebar-link"
                    :class="{ active: isRouteActive('dashboard.profiles.locations') }"
                    :to="{
                        name: 'dashboard.profiles.locations',
                        params: { profileId: profile.id },
                    }"
                    data-testid="my-locations-link"
                    @click="handleNavigate">
                    <FontAwesomeIcon :icon="faList" />
                    <p>Mijn Locaties</p>
                    <FontAwesomeIcon class="arrow-icon" :icon="faArrowRight" />
                </RouterLink>
                <RouterLink
                    class="sidebar-link"
                    :class="{ active: isRouteActive('locations.submit') }"
                    :to="{ name: 'locations.submit' }"
                    data-testid="new-location-link"
                    @click="handleNavigate">
                    <FontAwesomeIcon :icon="faPlus" />
                    <p>Nieuwe Locatie</p>
                    <FontAwesomeIcon class="arrow-icon" :icon="faArrowRight" />
                </RouterLink>
            </div>

            <div class="sidebar-section">
                <h4>
                    <FontAwesomeIcon class="leading-icon" :icon="faBuilding" />
                    <span>Autoriteiten</span>
                </h4>
                <RouterLink
                    class="sidebar-link"
                    :class="{ active: isRouteActive('dashboard.authorities') }"
                    :to="{ name: 'dashboard.authorities' }"
                    @click="handleNavigate">
                    <FontAwesomeIcon :icon="faList" />
                    <p>Mijn Autoriteiten</p>
                    <FontAwesomeIcon class="arrow-icon" :icon="faArrowRight" />
                </RouterLink>
            </div>

            <div class="sidebar-section">
                <h4>
                    <FontAwesomeIcon class="leading-icon" :icon="faCity" />
                    <span>Instituties</span>
                </h4>
                <RouterLink
                    class="sidebar-link"
                    :class="{ active: isRouteActive('dashboard.institutions.index') }"
                    :to="{ name: 'dashboard.institutions.index' }"
                    @click="handleNavigate">
                    <FontAwesomeIcon :icon="faList" />
                    <p>Mijn Instituties</p>
                    <FontAwesomeIcon class="arrow-icon" :icon="faArrowRight" />
                </RouterLink>
            </div>

            <div v-if="profile.isAdmin" class="sidebar-section">
                <h4>
                    <FontAwesomeIcon class="leading-icon" :icon="faChartLine" />
                    <span>Systeem</span>
                </h4>
                <RouterLink
                    class="sidebar-link"
                    :class="{ active: isRouteActive('dashboard.statistics') }"
                    :to="{ name: 'dashboard.statistics' }"
                    @click="handleNavigate">
                    <FontAwesomeIcon :icon="faChartSimple" />
                    <p>Statistieken</p>
                    <FontAwesomeIcon class="arrow-icon" :icon="faArrowRight" />
                </RouterLink>
                <RouterLink
                    class="sidebar-link"
                    :class="{ active: isRouteActive('dashboard.institutions.index') }"
                    :to="{ name: 'dashboard.institutions.index' }"
                    @click="handleNavigate">
                    <FontAwesomeIcon :icon="faCity" />
                    <p>Instituties</p>
                    <span v-if="counts && !isLoadingCounts" class="count">
                        ({{ abbreviateCount(counts.institutionCount) }})
                    </span>
                    <FontAwesomeIcon class="arrow-icon" :icon="faArrowRight" />
                </RouterLink>
                <RouterLink
                    class="sidebar-link"
                    :class="{ active: isRouteActive('dashboard.authorities') }"
                    :to="{ name: 'dashboard.authorities' }"
                    @click="handleNavigate">
                    <FontAwesomeIcon :icon="faBuilding" />
                    <p>Autoriteiten</p>
                    <span v-if="counts && !isLoadingCounts" class="count">
                        ({{ abbreviateCount(counts.authorityCount) }})
                    </span>
                    <FontAwesomeIcon class="arrow-icon" :icon="faArrowRight" />
                </RouterLink>
                <RouterLink
                    class="sidebar-link"
                    :class="{ active: isRouteActive('dashboard.locations.index') }"
                    :to="{ name: 'dashboard.locations.index' }"
                    @click="handleNavigate">
                    <FontAwesomeIcon :icon="faMapLocationDot" />
                    <p>Locaties</p>
                    <span v-if="counts && !isLoadingCounts" class="count">
                        ({{ abbreviateCount(counts.locationCount)
                        }}<span v-if="counts.pendingLocationCount > 0" class="pending"
                            ><b>+</b>{{ abbreviateCount(counts.pendingLocationCount) }}</span
                        >)
                    </span>
                    <FontAwesomeIcon class="arrow-icon" :icon="faArrowRight" />
                </RouterLink>
                <RouterLink
                    class="sidebar-link"
                    :class="{ active: isRouteActive('dashboard.profiles.index') }"
                    :to="{ name: 'dashboard.profiles.index' }"
                    @click="handleNavigate">
                    <FontAwesomeIcon :icon="faUsers" />
                    <p>Profielen</p>
                    <span v-if="counts && !isLoadingCounts" class="count">
                        ({{ abbreviateCount(counts.profileCount) }})
                    </span>
                    <FontAwesomeIcon class="arrow-icon" :icon="faArrowRight" />
                </RouterLink>
            </div>
        </div>

        <div class="sidebar-profile">
            <RouterLink
                class="sidebar-link"
                :to="{ name: 'profile' }"
                data-testid="profile-link"
                @click="handleNavigate">
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
                @click="handleLogoutClick">
                <FontAwesomeIcon :icon="faSignOut" />
                <span>Uitloggen</span>
            </button>
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.sidebar {
    @apply flex flex-col gap-5 pt-4 pb-5;
    @apply bg-slate-900 text-slate-300;

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
        @apply flex-1 space-y-6 px-5;

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

            .arrow-icon {
                @apply translate-x-2 opacity-0 transition-all duration-200;
            }
        }
    }

    .sidebar-items .sidebar-link {
        @apply flex w-full items-center space-x-3;
        @apply transition-colors duration-200 hover:text-slate-300;
        @apply border-l-2 border-transparent py-1;

        &:hover .arrow-icon {
            @apply translate-x-0 opacity-100;
        }

        &.active {
            @apply text-primary-300 border-l-primary-300 pl-2;

            .arrow-icon {
                @apply translate-x-0 opacity-100;
            }
        }

        &.router-link-active {
            @apply text-primary-300;
        }

        > *:first-child {
            @apply flex-shrink-0;
            width: 1rem;
            text-align: center;
        }

        p {
            @apply flex-1 text-sm font-medium;
        }

        .count {
            @apply text-xs font-medium text-slate-400;

            .pending {
                @apply text-primary-400;
            }
        }
    }

    .sidebar-link {
        @apply flex w-full items-center;
        @apply transition-colors duration-200 hover:text-slate-300;
    }

    .sidebar-profile {
        @apply space-y-3 border-t border-slate-700 p-4 pb-0;

        .sidebar-link {
            @apply gap-3 rounded-lg p-2 hover:bg-slate-800;

            &.logout-btn {
                @apply w-full cursor-pointer;
            }
        }
    }
}
</style>
