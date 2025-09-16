<script setup lang="ts">
import Badge from 'primevue/badge';
import ProfileAvatar from '@/components/features/profile/avatar/ProfileAvatar.vue';
import Logo from '@/components/shared/Logo.vue';
import {
    faArrowRight,
    faBuilding,
    faChartLine,
    faCity,
    faMapLocationDot,
    faSignOut,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useRouter } from 'vue-router';
import { useAuthLogout } from '@/composables/data/useAuth';
import type { Profile } from '@/domain/profile';

defineProps<{
    profile: Profile;
}>();

const router = useRouter();
const { mutateAsync: logout } = useAuthLogout();

async function handleLogoutClick(): Promise<void> {
    await router.push({ name: 'auth' });
    await logout();
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
                <RouterLink class="sidebar-link" :to="{ name: 'dashboard.locations' }">
                    <p>Mijn Locaties</p>
                    <FontAwesomeIcon class="arrow-icon" :icon="faArrowRight" />
                </RouterLink>
                <RouterLink
                    v-if="profile.isAdmin"
                    class="sidebar-link"
                    :to="{ name: 'dashboard.locations.index' }">
                    <p>Alle Locaties</p>
                    <FontAwesomeIcon class="arrow-icon" :icon="faArrowRight" />
                    <Badge
                        v-tooltip="'Zoek in alle locaties beschikbaar in Blokmap'"
                        class="ml-auto"
                        severity="contrast"
                        value="Admin" />
                </RouterLink>
            </div>

            <div class="sidebar-section">
                <h4>
                    <FontAwesomeIcon class="leading-icon" :icon="faBuilding" />
                    <span>Autoriteiten</span>
                </h4>
                <RouterLink class="sidebar-link" :to="{ name: 'dashboard.authorities' }">
                    <p>Mijn Autoriteiten</p>
                    <FontAwesomeIcon class="arrow-icon" :icon="faArrowRight" />
                </RouterLink>
                <RouterLink
                    v-if="profile.isAdmin"
                    class="sidebar-link"
                    :to="{ name: 'locations.submit' }">
                    <p>Alle Autoriteiten</p>
                    <FontAwesomeIcon class="arrow-icon" :icon="faArrowRight" />
                    <Badge
                        v-tooltip="'Zoek in alle autoriteiten beschikbaar in Blokmap'"
                        class="ml-auto"
                        severity="contrast"
                        value="Admin" />
                </RouterLink>
            </div>

            <div class="sidebar-section">
                <h4>
                    <FontAwesomeIcon class="leading-icon" :icon="faCity" />
                    <span>Instituties</span>
                </h4>
                <RouterLink class="sidebar-link" :to="{ name: 'dashboard.institutions' }">
                    <p>Mijn Instituties</p>
                    <FontAwesomeIcon class="arrow-icon" :icon="faArrowRight" />
                </RouterLink>
                <RouterLink
                    v-if="profile.isAdmin"
                    class="sidebar-link"
                    :to="{ name: 'locations.submit' }">
                    <p>Alle Instituties</p>
                    <FontAwesomeIcon class="arrow-icon" :icon="faArrowRight" />
                    <Badge
                        v-tooltip="'Zoek in alle instituties beschikbaar in Blokmap'"
                        class="ml-auto"
                        severity="contrast"
                        value="Admin" />
                </RouterLink>
            </div>

            <div v-if="profile.isAdmin" class="sidebar-section">
                <h4>
                    <FontAwesomeIcon class="leading-icon" :icon="faChartLine" />
                    <span>Systeem</span>
                </h4>
                <RouterLink class="sidebar-link" :to="{ name: 'dashboard.institutions' }">
                    <p>Statistieken</p>
                    <FontAwesomeIcon class="arrow-icon" :icon="faArrowRight" />
                </RouterLink>
                <RouterLink class="sidebar-link" :to="{ name: 'dashboard.institutions' }">
                    <p>Gebruikers</p>
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
            @apply space-y-3;

            &:not(:last-child) {
                @apply border-b border-slate-700 pb-6;
            }

            h4 {
                @apply flex items-center text-[15px] font-bold text-white;
            }

            .leading-icon {
                @apply text-primary-300 mr-2;
            }

            .arrow-icon {
                @apply ml-2 translate-x-2 opacity-0 transition-all duration-200;
            }
        }
    }

    .sidebar-link {
        @apply flex w-full items-center;
        @apply transition-colors duration-200 hover:text-slate-300;

        &:hover .arrow-icon {
            @apply translate-x-0 opacity-100;
        }

        p {
            @apply text-sm font-medium;
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
