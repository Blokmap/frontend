<script lang="ts" setup>
import Button from 'primevue/button';
import Popover from 'primevue/popover';
import Skeleton from 'primevue/skeleton';
import ProfileAvatar from '@/components/features/profile/avatar/ProfileAvatar.vue';
import { faBars, faRightToBracket, faSignOut, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useTemplateRef } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthLogout, useAuthProfile } from '@/composables/data/useAuth';

const router = useRouter();
const { isLoading: profileIsLoading, data: profile } = useAuthProfile();
const { mutateAsync: logout } = useAuthLogout();
const popoverRef = useTemplateRef('popover');

function toggleMenu(event: MouseEvent): void {
    popoverRef.value?.toggle(event);
}

async function handleLogout(): Promise<void> {
    await router.push({ name: 'auth' });
    await logout();
    popoverRef.value?.hide();
}

function closeMenu(): void {
    popoverRef.value?.hide();
}
</script>

<template>
    <Button @click="toggleMenu" rounded>
        <template #icon> <FontAwesomeIcon :icon="faBars" /></template>
    </Button>

    <Popover ref="popover" class="w-72 rounded-xl shadow-md">
        <!-- Loading State -->
        <div v-if="profileIsLoading" class="flex items-center gap-3 p-3">
            <Skeleton shape="circle" size="3rem" />
            <div class="flex-1 space-y-2">
                <Skeleton width="60%" height="1rem" />
                <Skeleton width="40%" height="0.75rem" />
            </div>
        </div>

        <!-- Authenticated User -->
        <template v-else-if="profile">
            <!-- Profile Header -->
            <RouterLink
                :to="{
                    name: 'dashboard.profiles.detail.overview',
                    params: { profileId: profile.id },
                }"
                @click="closeMenu"
                class="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-slate-50">
                <ProfileAvatar :profile="profile" class="h-12 w-12" />
                <div class="min-w-0 flex-1">
                    <div class="truncate font-semibold text-slate-900">
                        {{ profile.firstName }}
                    </div>
                    <div class="text-sm text-slate-500">Welkom terug!</div>
                </div>
            </RouterLink>

            <div class="border-t border-slate-100"></div>

            <!-- Menu Items -->
            <nav class="space-y-1 py-2">
                <RouterLink
                    :to="{
                        name: 'dashboard.profiles.detail.overview',
                        params: { profileId: profile.id },
                    }"
                    @click="closeMenu"
                    class="menu-item">
                    <FontAwesomeIcon :icon="faUser" class="w-4" />
                    <span>Profiel</span>
                </RouterLink>

                <button @click="handleLogout" class="menu-item w-full text-red-600">
                    <FontAwesomeIcon :icon="faSignOut" class="w-4" />
                    <span>Uitloggen</span>
                </button>
            </nav>
        </template>

        <!-- Guest User -->
        <div v-else class="space-y-3 p-3">
            <div>
                <h3 class="font-semibold text-slate-900">Welkom bij Blokmap</h3>
                <p class="mt-1 text-sm text-slate-600">Log in om plekken te reserveren</p>
            </div>

            <RouterLink :to="{ name: 'auth' }" @click="closeMenu" class="menu-item bg-slate-50">
                <FontAwesomeIcon :icon="faRightToBracket" class="w-4" />
                <span>Inloggen</span>
            </RouterLink>
        </div>
    </Popover>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
.menu-item {
    @apply flex items-center gap-3 rounded-lg px-3 py-2;
    @apply text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50;
}
</style>
