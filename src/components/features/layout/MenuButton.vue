<script lang="ts" setup>
import { useAuthLogout, useAuthProfile } from '@/composables/data/useAuth';
import {
    faBars,
    faDashboard,
    faInfoCircle,
    faMapLocation,
    faRightToBracket,
    faSignOut,
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
const { mutate: logout } = useAuthLogout();
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
    <Popover
        ref="popover"
        class="max-w-[300px] min-w-[240px] rounded-lg border border-slate-200 shadow-lg">
        <div class="text-sm text-slate-800 dark:text-slate-200">
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
                <div class="flex flex-col gap-2">
                    <div class="flex items-center gap-2">
                        <Avatar shape="circle" :label="profile.firstName?.[0]" class="text-md" />
                        <div class="space-y-1 leading-tight">
                            <div class="font-semibold text-slate-900 dark:text-white">
                                {{ profile.firstName }}
                            </div>
                            <div class="text-xs text-slate-500 dark:text-slate-400">
                                Welkom terug!
                            </div>
                        </div>
                    </div>

                    <RouterLink class="menu-link" :to="{ name: 'dashboard' }">
                        <FontAwesomeIcon :icon="faDashboard" class="text-secondary" />
                        <span>Ga naar je <span class="text-gradient-conic">Dashboard</span></span>
                    </RouterLink>

                    <div class="menu-link text-red-500" @click="() => logout()">
                        <FontAwesomeIcon :icon="faSignOut" />
                        <span>Uitloggen</span>
                    </div>
                </div>
            </template>

            <template v-else>
                <h3 class="text-lg font-bold">Jouw Profiel</h3>
                <p class="mt-2 mb-3 text-sm text-slate-500 dark:text-slate-400">
                    Reserveer een plek op een van onze
                    <span class="text-gradient-conic">Blokspots</span> of meld zelf een plek aan.
                </p>
                <div class="flex gap-1">
                    <div class="menu-link" @click="goTo('auth.login')">
                        <FontAwesomeIcon :icon="faRightToBracket" class="text-secondary" />
                        <span>Inloggen</span>
                    </div>
                    <div class="menu-link" @click="goTo('auth.register')">
                        <FontAwesomeIcon :icon="faUserPlus" class="text-secondary" />
                        <span>Registreren</span>
                    </div>
                </div>
            </template>

            <!-- Divider -->
            <div class="my-3 border-t border-slate-200 dark:border-slate-700" />

            <!-- Navigation -->
            <div class="flex flex-col gap-2">
                <RouterLink class="menu-link" :to="{ name: 'locations' }">
                    <FontAwesomeIcon :icon="faMapLocation" class="text-secondary" />
                    <span>Ontdek alle <span class="text-gradient-conic">Blokspots</span></span>
                </RouterLink>
                <RouterLink class="menu-link" :to="{ name: 'locations' }">
                    <FontAwesomeIcon :icon="faInfoCircle" class="text-secondary" />
                    <span>Open de <span class="text-gradient-conic">Handleiding</span></span>
                </RouterLink>
            </div>
        </div>
    </Popover>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.menu-link {
    @apply flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1 transition hover:bg-slate-100 dark:hover:bg-slate-800;
}
</style>
