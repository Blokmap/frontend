<script setup lang="ts">
import ProfileAvatar from '@/components/features/profile/avatar/ProfileAvatar.vue';
import Logo from '@/components/shared/Logo.vue';
import {
    faArrowRight,
    faBuilding,
    faChartLine,
    faChartSimple,
    faCity,
    faList,
    faMapLocationDot,
    faSignOut,
    faStar,
    faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useRouter, useRoute } from 'vue-router';
import { useAdminCounts } from '@/composables/data/useAdmin';
import { useAuthLogout } from '@/composables/data/useAuth';
import { abbreviateCount } from '@/utils/format';
import type { Profile } from '@/domain/profile';

defineProps<{
    profile: Profile;
}>();

const router = useRouter();
const route = useRoute();

const { mutateAsync: logout } = useAuthLogout();

const { data: counts, isLoading: isLoadingCounts } = useAdminCounts();

async function handleLogoutClick(): Promise<void> {
    await router.push({ name: 'auth' });
    await logout();
}

function isRouteActive(routeName: string): boolean {
    return route.name?.toString().startsWith(routeName) || false;
}
</script>

<template>
    <div class="sidebar">
        <!-- Logo Section -->
        <div class="flex justify-center py-1">
            <RouterLink :to="{ name: 'locations' }">
                <Logo light />
            </RouterLink>
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
                    :class="{ active: isRouteActive('dashboard.locations') }"
                    :to="{ name: 'dashboard.locations' }">
                    <FontAwesomeIcon :icon="faList" />
                    <p>Mijn Locaties</p>
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
                    :to="{ name: 'dashboard.authorities' }">
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
                    :class="{ active: isRouteActive('dashboard.institutions') }"
                    :to="{ name: 'dashboard.institutions' }">
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
                    :to="{ name: 'dashboard.statistics' }">
                    <FontAwesomeIcon :icon="faChartSimple" />
                    <p>Statistieken</p>
                    <FontAwesomeIcon class="arrow-icon" :icon="faArrowRight" />
                </RouterLink>
                <RouterLink
                    class="sidebar-link"
                    :class="{ active: isRouteActive('dashboard.institutions') }"
                    :to="{ name: 'dashboard.institutions' }">
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
                    :to="{ name: 'dashboard.authorities' }">
                    <FontAwesomeIcon :icon="faBuilding" />
                    <p>Autoriteiten</p>
                    <span v-if="counts && !isLoadingCounts" class="count">
                        ({{ abbreviateCount(counts.authorityCount) }})
                    </span>
                    <FontAwesomeIcon class="arrow-icon" :icon="faArrowRight" />
                </RouterLink>
                <RouterLink
                    class="sidebar-link"
                    :class="{ active: isRouteActive('dashboard.locations') }"
                    :to="{ name: 'dashboard.locations' }">
                    <FontAwesomeIcon :icon="faMapLocationDot" />
                    <p>Locaties</p>
                    <span v-if="counts && !isLoadingCounts" class="count">
                        ({{ abbreviateCount(counts.locationCount)
                        }}<span v-if="counts.pendingLocationCount > 0" class="pending"
                            >+{{ abbreviateCount(counts.pendingLocationCount) }}</span
                        >)
                    </span>
                    <FontAwesomeIcon class="arrow-icon" :icon="faArrowRight" />
                </RouterLink>
                <RouterLink
                    class="sidebar-link"
                    :class="{ active: isRouteActive('dashboard.users') }"
                    :to="{ name: 'dashboard.users' }">
                    <FontAwesomeIcon :icon="faUsers" />
                    <p>Gebruikers</p>
                    <span v-if="counts && !isLoadingCounts" class="count">
                        ({{ abbreviateCount(counts.profileCount) }})
                    </span>
                    <FontAwesomeIcon class="arrow-icon" :icon="faArrowRight" />
                </RouterLink>
                <RouterLink
                    class="sidebar-link"
                    :class="{ active: isRouteActive('dashboard.reviews') }"
                    :to="{ name: 'dashboard.reviews' }">
                    <FontAwesomeIcon :icon="faStar" />
                    <p>Reviews</p>
                    <FontAwesomeIcon class="arrow-icon" :icon="faArrowRight" />
                </RouterLink>
            </div>
        </div>

        <div class="sidebar-profile">
            <RouterLink class="sidebar-link" :to="{ name: 'profile' }">
                <ProfileAvatar :profile="profile" class="h-10 w-10" />
                <div class="flex-1 space-y-1 leading-tight">
                    <div class="text-sm font-semibold text-white">
                        {{ profile.firstName }}
                    </div>
                    <div class="text-xs text-slate-400">Welkom terug!</div>
                </div>
            </RouterLink>

            <button class="sidebar-link logout-btn" @click="handleLogoutClick">
                <FontAwesomeIcon :icon="faSignOut" />
                <span>Uitloggen</span>
            </button>
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.sidebar {
    @apply flex h-full flex-col bg-slate-900 py-1 text-slate-300;

    .sidebar-items {
        @apply flex-1 space-y-6 px-6 py-6;

        .sidebar-section {
            @apply space-y-1;

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

    .sidebar-link {
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
