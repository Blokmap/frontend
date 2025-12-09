<script lang="ts" setup>
import Button from 'primevue/button';
import Popover from 'primevue/popover';
import Skeleton from 'primevue/skeleton';
import ImageStack from '@/components/shared/molecules/ImageStack.vue';
import LanguageSelector from '@/components/shared/molecules/LanguageSelector.vue';
import EntityAvatar from '@/components/shared/molecules/avatar/EntityAvatar.vue';
import {
    faBars,
    faCalendarAlt,
    faGlobe,
    faQuestionCircle,
    faRightToBracket,
    faSignOut,
    faSliders,
    faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, useTemplateRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useAuthLogout } from '@/composables/data/useAuth';
import { useReadRecentProfileLocations } from '@/composables/data/useLocations';
import { DOCS_URL } from '@/config';
import { getLocationImages, type Image } from '@/domain/image';
import type { Profile } from '@/domain/profile/types/profileSchemaTypes';

const props = defineProps<{
    loading?: boolean;
    profile?: Profile | null;
}>();

const { locale } = useI18n();
const router = useRouter();

const { mutateAsync: logout } = useAuthLogout();

const { data: recentLocations } = useReadRecentProfileLocations(
    computed(() => props.profile?.id ?? null),
    computed(() => ({ maxCount: 3 })),
);

const recentLocationImages = computed<Image[] | undefined>(() =>
    getLocationImages(recentLocations.value),
);

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
        <template #icon>
            <FontAwesomeIcon :icon="faBars" />
        </template>
    </Button>

    <Popover ref="popover" class="menu-popover">
        <!-- Loading State -->
        <div v-if="loading" class="menu-popover__loading">
            <Skeleton shape="circle" size="3rem" />
            <div class="menu-popover__loading-text">
                <Skeleton width="60%" height="1rem" />
                <Skeleton width="40%" height="0.75rem" />
            </div>
        </div>

        <!-- Loaded State -->
        <div v-else class="max-w-[300px]">
            <!-- Profile Header -->
            <RouterLink
                v-if="profile"
                :to="{ name: 'profile' }"
                @click="closeMenu"
                class="menu-popover__profile">
                <EntityAvatar :image="profile.avatar?.url" class="h-12 w-12" />
                <div class="menu-popover__profile-info">
                    <div class="menu-popover__profile-name">
                        {{ profile.firstName }}
                    </div>
                    <div class="menu-popover__profile-greeting">Welkom terug!</div>
                </div>
            </RouterLink>

            <div class="menu-popover__divider"></div>

            <!-- Navigation Items (Authenticated) -->
            <nav v-if="profile" class="menu-popover__nav">
                <RouterLink :to="{ name: 'profile' }" @click="closeMenu" class="menu-popover__item">
                    <FontAwesomeIcon :icon="faUser" class="w-4" />
                    <span>Profiel</span>
                </RouterLink>

                <RouterLink
                    :to="{ name: 'profile', hash: '#reservations' }"
                    @click="closeMenu"
                    class="menu-popover__item">
                    <FontAwesomeIcon :icon="faCalendarAlt" class="w-4" />
                    <span>Reservaties</span>
                </RouterLink>

                <RouterLink :to="{ name: 'manage' }" class="menu-popover__item">
                    <FontAwesomeIcon :icon="faSliders" class="w-4" />
                    <span>Beheermodus</span>
                </RouterLink>
            </nav>

            <div v-if="profile" class="menu-popover__divider"></div>

            <!-- CTA Section -->
            <RouterLink
                :to="{ name: 'locations.submit' }"
                @click="closeMenu"
                class="menu-popover__cta">
                <ImageStack class="menu-popover__cta-img" :images="recentLocationImages" />
                <div class="menu-popover__cta-content">
                    <p class="menu-popover__cta-title">Zelf een locatie aanbieden?</p>
                    <p class="menu-popover__cta-subtitle">
                        Dien zelf een locatie in als student of organisatie.
                    </p>
                </div>
            </RouterLink>

            <div class="menu-popover__divider"></div>

            <!-- Settings -->
            <nav class="menu-popover__nav">
                <LanguageSelector v-model="locale">
                    <template #button="{ toggle }">
                        <button class="menu-popover__item" @click="toggle">
                            <FontAwesomeIcon :icon="faGlobe" class="w-4" />
                            <span>Taal</span>
                        </button>
                    </template>
                </LanguageSelector>

                <a :href="DOCS_URL" target="_blank" class="menu-popover__item">
                    <FontAwesomeIcon :icon="faQuestionCircle" class="w-4" />
                    <span>Helpcentrum</span>
                </a>
            </nav>

            <div class="menu-popover__divider"></div>

            <!-- Logout -->
            <nav v-if="profile" class="menu-popover__nav">
                <button @click="handleLogout" class="menu-popover__item menu-popover__item--danger">
                    <FontAwesomeIcon :icon="faSignOut" class="w-4" />
                    <span>Uitloggen</span>
                </button>
            </nav>

            <!-- Login  -->
            <nav v-else class="menu-popover__nav">
                <RouterLink :to="{ name: 'auth' }" @click="closeMenu" class="menu-popover__item">
                    <FontAwesomeIcon :icon="faRightToBracket" class="w-4" />
                    <span>Inloggen</span>
                </RouterLink>
            </nav>
        </div>
    </Popover>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.menu-popover {
    @apply rounded-xl shadow-lg;
}

.menu-popover__loading {
    @apply flex items-center gap-3 p-3;
}

.menu-popover__loading-text {
    @apply flex-1 space-y-2;
}

.menu-popover__profile {
    @apply flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-slate-50;
}

.menu-popover__profile-info {
    @apply min-w-0 flex-1;
}

.menu-popover__profile-name {
    @apply truncate font-semibold text-slate-900;
}

.menu-popover__profile-greeting {
    @apply text-sm text-slate-500;
}

.menu-popover__divider {
    @apply border-t border-slate-100;
}

.menu-popover__nav {
    @apply space-y-1 py-2;
}

.menu-popover__item {
    @apply flex w-full items-center gap-3 rounded-lg px-3 py-2;
    @apply text-base font-medium text-slate-700 transition-colors hover:bg-slate-50;
}

.menu-popover__item--danger {
    @apply text-blushed-brick-500;
}

.menu-popover__cta {
    @apply flex items-center gap-3 p-3;
    @apply cursor-pointer rounded-lg transition-colors hover:bg-slate-50;
}

.menu-popover__cta-img {
    @apply h-17 w-17 flex-shrink-0 object-contain;
}

.menu-popover__cta-content {
    @apply flex-1 space-y-2;
}

.menu-popover__cta-title {
    @apply text-sm font-bold;
}

.menu-popover__cta-subtitle {
    @apply text-xs;
}
</style>
