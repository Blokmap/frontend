<script lang="ts" setup>
import ProfileAvatar from '@/components/features/profile/avatar/ProfileAvatar.vue';
import { useAuthLogout, useAuthProfile } from '@/composables/data/useAuth';
import { DOCS_URL } from '@/constants';
import {
    faBars,
    faCalendarDays,
    faInfoCircle,
    faMapLocation,
    faRightToBracket,
    faSignOut,
    faUserPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Button from 'primevue/button';
import Popover from 'primevue/popover';
import Skeleton from 'primevue/skeleton';
import { useTemplateRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const router = useRouter();
const { locale } = useI18n();
const { isLoading: profileIsLoading, data: profile } = useAuthProfile();
const { mutateAsync: logout } = useAuthLogout();

const popoverRef = useTemplateRef('popover');

function handleMenuButtonClick(event: MouseEvent): void {
    popoverRef.value?.toggle(event);
}

async function handleLogoutClick(): Promise<void> {
    await router.push({ name: 'auth' });
    await logout();
    popoverRef.value?.hide();
}

function handleNavigationClick(): void {
    popoverRef.value?.hide();
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
        class="w-full max-w-[300px] rounded-lg border border-slate-200 shadow-lg">
        <div class="dark:text-slate-20 p-1 text-sm text-slate-800">
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
                <div class="flex flex-col gap-3">
                    <RouterLink
                        class="flex items-center gap-3"
                        :to="{ name: 'profile' }"
                        @click="handleNavigationClick">
                        <ProfileAvatar :profile="profile" class="h-[3rem] w-[3rem]" />
                        <div class="flex-1 space-y-1 leading-tight">
                            <div class="font-semibold text-slate-900 dark:text-white">
                                {{ profile.firstName }}
                            </div>
                            <div class="text-xs text-slate-500 dark:text-slate-400">
                                Welkom terug!
                            </div>
                        </div>

                        <div
                            class="ms-auto cursor-pointer self-end text-[10px] text-red-500 hover:text-red-600"
                            @click.prevent="handleLogoutClick">
                            <FontAwesomeIcon :icon="faSignOut" class="me-1" />
                            <span>Uitloggen</span>
                        </div>
                    </RouterLink>

                    <RouterLink
                        class="menu-link"
                        :to="{ name: 'profile' }"
                        @click="handleNavigationClick">
                        <FontAwesomeIcon :icon="faCalendarDays" class="text-secondary" />
                        <span>Ga naar je <span class="text-gradient-conic">overzicht</span></span>
                    </RouterLink>
                </div>
            </template>

            <template v-else>
                <h3 class="text-lg font-bold">Jouw Profiel</h3>
                <p class="mt-2 mb-3 text-sm text-slate-500 dark:text-slate-400">
                    Reserveer een plek op een van onze
                    <span class="text-gradient-conic">locaties</span> of meld zelf een plek aan.
                </p>
                <div class="flex gap-1">
                    <RouterLink
                        class="menu-link"
                        :to="{ name: 'auth' }"
                        @click="handleNavigationClick">
                        <FontAwesomeIcon :icon="faRightToBracket" class="text-secondary" />
                        <span>Inloggen</span>
                    </RouterLink>
                    <RouterLink
                        class="menu-link"
                        :to="{ name: 'auth' }"
                        @click="handleNavigationClick">
                        <FontAwesomeIcon :icon="faUserPlus" class="text-secondary" />
                        <span>Registreren</span>
                    </RouterLink>
                </div>
            </template>

            <!-- Divider -->
            <div class="my-3 border-t border-slate-200 dark:border-slate-700" />

            <!-- Navigation -->
            <div class="flex flex-col gap-2">
                <RouterLink
                    class="menu-link"
                    :to="{ name: 'locations' }"
                    @click="handleNavigationClick">
                    <FontAwesomeIcon :icon="faMapLocation" class="text-secondary" />
                    <span>Ontdek alle <span class="text-gradient-conic">locaties</span></span>
                </RouterLink>
            </div>

            <!-- Help Section -->
            <div class="mt-3 flex justify-end">
                <a class="help-link" :href="DOCS_URL + '/' + locale" @click="handleNavigationClick">
                    <FontAwesomeIcon :icon="faInfoCircle" class="text-slate-500" />
                    <span>Handleiding</span>
                </a>
            </div>
        </div>
    </Popover>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.menu-link {
    @apply flex w-full cursor-pointer items-center gap-2 px-2 py-1;
    @apply rounded-md transition hover:bg-slate-100 dark:hover:bg-slate-800;
}

.help-link {
    @apply flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-xs;
    @apply text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200;
}
</style>
