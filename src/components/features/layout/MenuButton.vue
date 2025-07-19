<script lang="ts" setup>
import { useAuthProfile } from '@/composables/data/useAuth';
import {
    faBars,
    faMapLocation,
    faRightToBracket,
    faSignOut,
    faUser,
    faUserGear,
    faUserPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Avatar from 'primevue/avatar';
import Button from 'primevue/button';
import Popover from 'primevue/popover';
import Skeleton from 'primevue/skeleton';
import { useTemplateRef } from 'vue';
import { useRouter } from 'vue-router';

const { isLoading: profileIsLoading, data: profile } = useAuthProfile();
const popoverRef = useTemplateRef('popover');
const router = useRouter();

function handleMenuButtonClick(event: MouseEvent): void {
    popoverRef.value?.toggle(event);
}

function goTo(routeName: string): void {
    popoverRef.value?.hide();
    router.push({ name: routeName });
}
</script>

<template>
    <!-- Menu Toggle -->
    <Button severity="contrast" @click="handleMenuButtonClick" rounded class="!px-3 !py-2">
        <template #icon>
            <FontAwesomeIcon :icon="faBars" />
        </template>
    </Button>

    <!-- Popover -->
    <Popover ref="popover" class="min-w-[240px] rounded-lg border border-slate-200 shadow-lg">
        <div class="space-y-3 px-3 py-2 text-sm text-slate-800 dark:text-slate-200">
            <!-- Profile Section -->
            <template v-if="profileIsLoading">
                <div class="flex items-center gap-3">
                    <Skeleton shape="circle" size="2rem" />
                    <div class="flex-1 space-y-1">
                        <Skeleton width="70%" />
                        <Skeleton width="40%" />
                    </div>
                </div>
            </template>

            <template v-else-if="profile">
                <div
                    class="flex cursor-pointer items-center gap-3 rounded-md p-2 transition hover:bg-slate-100 dark:hover:bg-slate-800"
                    @click="goTo('profile')">
                    <Avatar shape="circle" :label="profile.firstName[0]" class="text-sm" />
                    <div class="leading-tight">
                        <div class="font-semibold text-slate-900 dark:text-white">
                            {{ profile.firstName }}
                        </div>
                        <div class="text-xs text-slate-500 dark:text-slate-400">View profile</div>
                    </div>
                </div>
                <Button
                    text
                    class="w-full justify-start rounded-md px-2 py-1.5 text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    @click="goTo('logout')">
                    <FontAwesomeIcon :icon="faSignOut" class="mr-2" />
                    Logout
                </Button>
            </template>

            <template v-else>
                <div class="flex flex-col gap-2">
                    <button class="menu-link" @click="goTo('auth.login')">
                        <FontAwesomeIcon :icon="faRightToBracket" class="text-secondary" />
                        <span>Login</span>
                    </button>
                    <button class="menu-link" @click="goTo('auth.register')">
                        <FontAwesomeIcon :icon="faUserPlus" class="text-secondary" />
                        <span>Register</span>
                    </button>
                </div>
            </template>

            <!-- Divider -->
            <div class="border-t border-slate-200 dark:border-slate-700" />

            <!-- Navigation -->
            <div class="flex flex-col gap-2">
                <button class="menu-link" @click="goTo('dashboard')">
                    <FontAwesomeIcon :icon="faMapLocation" class="text-secondary" />
                    <span>Dashboard</span>
                </button>
            </div>
        </div>
    </Popover>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.menu-link {
    @apply flex items-center gap-2 rounded-md px-2 py-1.5 transition hover:bg-slate-100 dark:hover:bg-slate-800;
}
</style>
