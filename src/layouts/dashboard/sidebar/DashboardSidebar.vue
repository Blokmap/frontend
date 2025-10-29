<script setup lang="ts">
import ProfileAvatar from '@/components/features/profile/avatar/ProfileAvatar.vue';
import Logo from '@/components/shared/atoms/Logo.vue';
import {
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
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAdminCounts } from '@/composables/data/useAdmin';
import { useAuthLogout } from '@/composables/data/useAuth';
import { abbreviateCount } from '@/utils/format';
import SidebarLink from './SidebarLink.vue';
import type { Profile } from '@/domain/profile';
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
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

interface NavLink {
    id: string;
    icon: IconDefinition;
    label: string;
    to: RouteLocationRaw;
    testId?: string;
    count?: () => string | null | undefined;
    pendingCount?: () => number | undefined;
    show?: () => boolean;
}

interface NavSection {
    title: string;
    icon: IconDefinition;
    links: NavLink[];
    show?: () => boolean;
}

const navSections = computed(() => {
    const sections: NavSection[] = [
        {
            title: 'Locaties',
            icon: faMapLocationDot,
            links: [
                {
                    id: 'my-locations',
                    icon: faList,
                    label: 'Mijn Locaties',
                    to: {
                        name: 'dashboard.profiles.detail.locations',
                        params: { profileId: props.profile.id },
                    },
                    testId: 'my-locations-link',
                },
                {
                    id: 'new-location',
                    icon: faPlus,
                    label: 'Nieuwe Locatie',
                    to: { name: 'locations.submit' },
                    testId: 'new-location-link',
                },
            ],
        },
        {
            title: 'Autoriteiten',
            icon: faBuilding,
            links: [
                {
                    id: 'my-authorities',
                    icon: faList,
                    label: 'Mijn Autoriteiten',
                    to: {
                        name: 'dashboard.profiles.detail.authorities',
                        params: { profileId: props.profile.id },
                    },
                },
                {
                    id: 'new-authority',
                    icon: faPlus,
                    label: 'Nieuwe Autoriteit',
                    to: { name: 'dashboard.authorities.create' },
                    show: () => props.profile.isAdmin,
                },
            ],
        },
        {
            title: 'Instituties',
            icon: faCity,
            links: [
                {
                    id: 'my-institutions',
                    icon: faList,
                    label: 'Mijn Instituties',
                    to: {
                        name: 'dashboard.profiles.detail.institutions',
                        params: { profileId: props.profile.id },
                    },
                },
            ],
        },
        {
            title: 'Systeem',
            icon: faChartLine,
            show: () => props.profile.isAdmin,
            links: [
                {
                    id: 'statistics',
                    icon: faChartSimple,
                    label: 'Statistieken',
                    to: { name: 'dashboard.statistics' },
                },
                {
                    id: 'institutions',
                    icon: faCity,
                    label: 'Instituties',
                    to: { name: 'dashboard.institutions.index' },
                    count: () =>
                        counts.value && !isLoadingCounts.value
                            ? abbreviateCount(counts.value.institutionCount)
                            : undefined,
                },
                {
                    id: 'authorities',
                    icon: faBuilding,
                    label: 'Autoriteiten',
                    to: { name: 'dashboard.authorities.index' },
                    count: () =>
                        counts.value && !isLoadingCounts.value
                            ? abbreviateCount(counts.value.authorityCount)
                            : undefined,
                },
                {
                    id: 'locations',
                    icon: faMapLocationDot,
                    label: 'Locaties',
                    to: { name: 'dashboard.locations.index' },
                    count: () =>
                        counts.value && !isLoadingCounts.value
                            ? abbreviateCount(counts.value.locationCount)
                            : undefined,
                    pendingCount: () => counts.value?.pendingLocationCount,
                },
                {
                    id: 'profiles',
                    icon: faUsers,
                    label: 'Profielen',
                    to: { name: 'dashboard.profiles.index' },
                    count: () =>
                        counts.value && !isLoadingCounts.value
                            ? abbreviateCount(counts.value.profileCount)
                            : undefined,
                },
            ],
        },
    ];
    return sections;
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
            <div
                v-for="section in navSections"
                :key="section.title"
                v-show="!section.show || section.show()"
                class="sidebar-section">
                <h4>
                    <FontAwesomeIcon class="leading-icon" :icon="section.icon" />
                    <span>{{ section.title }}</span>
                </h4>
                <SidebarLink
                    v-for="link in section.links"
                    :key="link.id"
                    v-show="!link.show || link.show()"
                    :icon="link.icon"
                    :label="link.label"
                    :count="link.count?.()"
                    :pending-count="link.pendingCount?.()"
                    :is-navigating="navigatingTo === link.id"
                    :test-id="link.testId"
                    @click="handleNavigation(link.to, link.id)">
                </SidebarLink>
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
