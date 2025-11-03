<script lang="ts" setup>
import Button from 'primevue/button';
import Popover from 'primevue/popover';
import Skeleton from 'primevue/skeleton';
import ProfileAvatar from '@/components/features/profile/avatar/ProfileAvatar.vue';
import {
    faBars,
    faCity,
    faRightToBracket,
    faSignOut,
    faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useTemplateRef } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthLogout, useAuthProfile } from '@/composables/data/useAuth';

const router = useRouter();
const { isLoading: profileIsLoading, data: profile } = useAuthProfile();
const { mutateAsync: logout } = useAuthLogout();

const popoverRef = useTemplateRef('popover');

/**
 * Handle menu button click event.
 * Toggles the popover display.
 *
 * @param event - Mouse event needed for popover positioning
 */
function handleMenuButtonClick(event: MouseEvent): void {
    popoverRef.value?.toggle(event);
}

/**
 * Handle logout click event.
 * Logs out the user and navigates to the auth page.
 */
async function handleLogoutClick(): Promise<void> {
    await router.push({ name: 'auth' });
    await logout();
    popoverRef.value?.hide();
}

/**
 * Handle navigation link click event.
 * Hides the popover.
 */
function handleNavigationClick(): void {
    popoverRef.value?.hide();
}
</script>

<template>
    <!-- Menu Toggle -->
    <Button class="!px-3 !py-2" @click="handleMenuButtonClick" rounded>
        <template #icon>
            <FontAwesomeIcon :icon="faBars" />
        </template>
    </Button>

    <!-- Popover -->
    <Popover ref="popover" class="w-full max-w-[275px] rounded-lg">
        <div class="dark:text-slate-20 space-y-2 p-1 text-slate-800">
            <!-- Profile Section -->
            <template v-if="profileIsLoading">
                <div class="flex items-center gap-3">
                    <Skeleton shape="circle" size="3rem" />
                    <div class="flex-1 space-y-1">
                        <Skeleton width="70%" />
                        <Skeleton width="40%" />
                    </div>
                </div>
            </template>

            <template v-else-if="profile">
                <RouterLink
                    class="flex items-center gap-3 rounded-lg bg-slate-100 p-2"
                    :to="{ name: 'profile' }"
                    @click="handleNavigationClick">
                    <ProfileAvatar :profile="profile" class="h-[3rem] w-[3rem]" />
                    <div class="flex-1 space-y-1 leading-tight">
                        <div class="font-semibold text-slate-900 dark:text-white">
                            {{ profile.firstName }}
                        </div>
                        <div class="text-xs text-slate-500 dark:text-slate-400">Welkom terug!</div>
                    </div>
                </RouterLink>
                <RouterLink
                    class="menu-link"
                    :to="{ name: 'profile' }"
                    @click="handleNavigationClick">
                    <FontAwesomeIcon :icon="faUser" class="text-secondary fa-icon" />
                    <span>Profiel en Reservaties</span>
                </RouterLink>
                <RouterLink
                    class="menu-link"
                    :to="{ name: 'dashboard' }"
                    @click="handleNavigationClick">
                    <FontAwesomeIcon :icon="faCity" class="text-secondary fa-icon" />
                    <span>Dashboard</span>
                </RouterLink>
            </template>

            <template v-else>
                <h3 class="font-semibold">Profiel</h3>
                <p class="text-sm text-slate-500 dark:text-slate-400">
                    Reserveer een plek op een van onze locaties of meld zelf een plek aan.
                </p>
                <RouterLink class="menu-link" :to="{ name: 'auth' }" @click="handleNavigationClick">
                    <FontAwesomeIcon :icon="faRightToBracket" class="text-secondary fa-icon" />
                    <span>Inloggen</span>
                </RouterLink>
            </template>
            <template v-if="profile">
                <div class="menu-link logout-link" @click="handleLogoutClick">
                    <FontAwesomeIcon :icon="faSignOut" class="text-secondary fa-icon" />
                    <span>Uitloggen</span>
                </div>
            </template>
        </div>
    </Popover>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.menu-link {
    @apply flex w-full cursor-pointer items-center gap-2;

    .fa-icon {
        @apply w-4 text-center;
    }
}
</style>
