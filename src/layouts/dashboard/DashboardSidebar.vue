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
    faSpinner,
    faTimes,
    faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAdminCounts } from '@/composables/data/useAdmin';
import { useAuthLogout } from '@/composables/data/useAuth';
import { abbreviateCount } from '@/utils/format';
import type { Profile } from '@/domain/profile';
import type { RouteLocationRaw } from 'vue-router';

const props = defineProps<{
    profile: Profile;
}>();

const visible = defineModel<boolean>('visible', { default: false });

const router = useRouter();
const navigatingTo = ref<string | null>(null);

const { mutateAsync: logout } = useAuthLogout();

const { data: counts, isLoading: isLoadingCounts } = useAdminCounts({
    enabled: computed(() => props.profile.isAdmin),
});

async function handleLogoutClick(): Promise<void> {
    await router.push({ name: 'auth' });
    await logout();
}

async function handleNavigation(to: RouteLocationRaw, linkId: string) {
    navigatingTo.value = linkId;
    await router.push(to);
    visible.value = false;
    navigatingTo.value = null;
}

function closeMenu() {
    visible.value = false;
}
</script>

<template>
    <div class="sidebar" data-testid="dashboard-sidebar">
        <!-- Logo and Close Button Section -->
        <div class="sidebar-header">
            <RouterLink :to="{ name: 'locations' }" data-testid="logo-link">
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
                <a
                    class="sidebar-link"
                    @click.prevent="
                        handleNavigation(
                            {
                                name: 'dashboard.profiles.detail.locations',
                                params: { profileId: profile.id },
                            },
                            'my-locations',
                        )
                    "
                    data-testid="my-locations-link">
                    <FontAwesomeIcon
                        :icon="navigatingTo === 'my-locations' ? faSpinner : faList"
                        :class="{ 'fa-spin': navigatingTo === 'my-locations' }" />
                    <p>Mijn Locaties</p>
                    <FontAwesomeIcon class="arrow-icon" :icon="faArrowRight" />
                </a>
                <a
                    class="sidebar-link"
                    @click.prevent="handleNavigation({ name: 'locations.submit' }, 'new-location')"
                    data-testid="new-location-link">
                    <FontAwesomeIcon
                        :icon="navigatingTo === 'new-location' ? faSpinner : faPlus"
                        :class="{ 'fa-spin': navigatingTo === 'new-location' }" />
                    <p>Nieuwe Locatie</p>
                    <FontAwesomeIcon class="arrow-icon" :icon="faArrowRight" />
                </a>
            </div>

            <div class="sidebar-section">
                <h4>
                    <FontAwesomeIcon class="leading-icon" :icon="faBuilding" />
                    <span>Autoriteiten</span>
                </h4>
                <a
                    class="sidebar-link"
                    @click.prevent="
                        handleNavigation(
                            {
                                name: 'dashboard.profiles.detail.authorities',
                                params: { profileId: profile.id },
                            },
                            'my-authorities',
                        )
                    ">
                    <FontAwesomeIcon
                        :icon="navigatingTo === 'my-authorities' ? faSpinner : faList"
                        :class="{ 'fa-spin': navigatingTo === 'my-authorities' }" />
                    <p>Mijn Autoriteiten</p>
                    <FontAwesomeIcon class="arrow-icon" :icon="faArrowRight" />
                </a>
                <a
                    v-if="profile.isAdmin"
                    class="sidebar-link"
                    @click.prevent="
                        handleNavigation({ name: 'dashboard.authorities.create' }, 'new-authority')
                    ">
                    <FontAwesomeIcon
                        :icon="navigatingTo === 'new-authority' ? faSpinner : faPlus"
                        :class="{ 'fa-spin': navigatingTo === 'new-authority' }" />
                    <p>Nieuwe Autoriteit</p>
                    <FontAwesomeIcon class="arrow-icon" :icon="faArrowRight" />
                </a>
            </div>

            <div class="sidebar-section">
                <h4>
                    <FontAwesomeIcon class="leading-icon" :icon="faCity" />
                    <span>Instituties</span>
                </h4>
                <a
                    class="sidebar-link"
                    @click.prevent="
                        handleNavigation(
                            {
                                name: 'dashboard.profiles.detail.institutions',
                                params: { profileId: profile.id },
                            },
                            'my-institutions',
                        )
                    ">
                    <FontAwesomeIcon
                        :icon="navigatingTo === 'my-institutions' ? faSpinner : faList"
                        :class="{ 'fa-spin': navigatingTo === 'my-institutions' }" />
                    <p>Mijn Instituties</p>
                    <FontAwesomeIcon class="arrow-icon" :icon="faArrowRight" />
                </a>
            </div>

            <div v-if="profile.isAdmin" class="sidebar-section">
                <h4>
                    <FontAwesomeIcon class="leading-icon" :icon="faChartLine" />
                    <span>Systeem</span>
                </h4>
                <a
                    class="sidebar-link"
                    @click.prevent="
                        handleNavigation({ name: 'dashboard.statistics' }, 'statistics')
                    ">
                    <FontAwesomeIcon
                        :icon="navigatingTo === 'statistics' ? faSpinner : faChartSimple"
                        :class="{ 'fa-spin': navigatingTo === 'statistics' }" />
                    <p>Statistieken</p>
                    <FontAwesomeIcon class="arrow-icon" :icon="faArrowRight" />
                </a>
                <a
                    class="sidebar-link"
                    @click.prevent="
                        handleNavigation({ name: 'dashboard.institutions.index' }, 'institutions')
                    ">
                    <FontAwesomeIcon
                        :icon="navigatingTo === 'institutions' ? faSpinner : faCity"
                        :class="{ 'fa-spin': navigatingTo === 'institutions' }" />
                    <p>Instituties</p>
                    <span v-if="counts && !isLoadingCounts" class="count">
                        ({{ abbreviateCount(counts.institutionCount) }})
                    </span>
                    <FontAwesomeIcon class="arrow-icon" :icon="faArrowRight" />
                </a>
                <a
                    class="sidebar-link"
                    @click.prevent="
                        handleNavigation({ name: 'dashboard.authorities.index' }, 'authorities')
                    ">
                    <FontAwesomeIcon
                        :icon="navigatingTo === 'authorities' ? faSpinner : faBuilding"
                        :class="{ 'fa-spin': navigatingTo === 'authorities' }" />
                    <p>Autoriteiten</p>
                    <span v-if="counts && !isLoadingCounts" class="count">
                        ({{ abbreviateCount(counts.authorityCount) }})
                    </span>
                    <FontAwesomeIcon class="arrow-icon" :icon="faArrowRight" />
                </a>
                <a
                    class="sidebar-link"
                    @click.prevent="
                        handleNavigation({ name: 'dashboard.locations.index' }, 'locations')
                    ">
                    <FontAwesomeIcon
                        :icon="navigatingTo === 'locations' ? faSpinner : faMapLocationDot"
                        :class="{ 'fa-spin': navigatingTo === 'locations' }" />
                    <p>Locaties</p>
                    <span v-if="counts && !isLoadingCounts" class="count">
                        ({{ abbreviateCount(counts.locationCount)
                        }}<span v-if="counts.pendingLocationCount > 0" class="pending"
                            ><b>+</b>{{ abbreviateCount(counts.pendingLocationCount) }}</span
                        >)
                    </span>
                    <FontAwesomeIcon class="arrow-icon" :icon="faArrowRight" />
                </a>
                <a
                    class="sidebar-link"
                    @click.prevent="
                        handleNavigation({ name: 'dashboard.profiles.index' }, 'profiles')
                    ">
                    <FontAwesomeIcon
                        :icon="navigatingTo === 'profiles' ? faSpinner : faUsers"
                        :class="{ 'fa-spin': navigatingTo === 'profiles' }" />
                    <p>Profielen</p>
                    <span v-if="counts && !isLoadingCounts" class="count">
                        ({{ abbreviateCount(counts.profileCount) }})
                    </span>
                    <FontAwesomeIcon class="arrow-icon" :icon="faArrowRight" />
                </a>
            </div>
        </div>

        <div class="sidebar-profile">
            <a
                class="sidebar-link"
                @click.prevent="handleNavigation({ name: 'profile' }, 'profile')"
                data-testid="profile-link">
                <ProfileAvatar :profile="profile" class="h-10 w-10" />
                <div class="flex-1 space-y-1 leading-tight">
                    <div class="text-sm font-semibold text-white">
                        {{ profile.firstName }}
                    </div>
                    <div class="text-xs text-slate-400">Welkom terug!</div>
                </div>
            </a>

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
        @apply cursor-pointer transition-colors duration-200 hover:text-slate-300;
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
        @apply cursor-pointer transition-colors duration-200 hover:text-slate-300;
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
