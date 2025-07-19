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
    <!-- Menu Toggle Button -->
    <Button severity="contrast" @click="handleMenuButtonClick" rounded class="!px-3 !py-2">
        <template #icon>
            <FontAwesomeIcon :icon="faBars" />
        </template>
    </Button>

    <!-- Popover Menu -->
    <Popover ref="popover">
        <!-- Auth Section -->
        <div class="space-y-2">
            <template v-if="profileIsLoading">
                <div class="flex items-center gap-3">
                    <Skeleton shape="circle" size="2rem" />
                    <div class="flex-1">
                        <Skeleton width="70%" class="mb-1" />
                        <Skeleton width="50%" />
                    </div>
                </div>
            </template>
            <template v-else-if="profile">
                <div
                    class="flex cursor-pointer items-center gap-3 rounded p-2 hover:bg-slate-100"
                    @click="goTo('profile')">
                    <Avatar shape="circle" :label="profile.firstName[0]" />
                    <div class="flex flex-col">
                        <span class="font-semibold">{{ profile.firstName }}</span>
                        <span class="text-sm text-gray-500">View profile</span>
                    </div>
                </div>
                <Button
                    text
                    class="mt-2 w-full justify-start text-sm text-red-500"
                    @click="goTo('logout')">
                    <FontAwesomeIcon :icon="faSignOut" class="mr-2" /> Logout
                </Button>
            </template>
            <template v-else>
                <div class="menu-item" @click="goTo('auth.login')">
                    <FontAwesomeIcon :icon="faRightToBracket" class="text-secondary" />
                    <span class="text-sm">Login</span>
                </div>
                <div class="menu-item" @click="goTo('auth.register')">
                    <FontAwesomeIcon :icon="faUserPlus" class="text-secondary" />
                    <span class="text-sm">Register</span>
                </div>
            </template>
        </div>

        <hr class="my-2 border-slate-200" />

        <!-- Navigation Section -->
        <div class="space-y-2"></div>
    </Popover>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.menu-item {
    @apply flex items-center gap-3 rounded p-2 transition-colors duration-200 hover:bg-slate-100;
}
</style>
