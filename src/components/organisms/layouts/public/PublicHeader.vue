<script setup lang="ts">
import Button from 'primevue/button';
import Logo from '@/components/atoms/Logo.vue';
import ImageStack from '@/components/molecules/ImageStack.vue';
import EntityAvatar from '@/components/molecules/avatar/EntityAvatar.vue';
import { faBars, faSearch, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import calendar from '@/assets/img/illustrations/calendar.png';
import map from '@/assets/img/illustrations/map.jpg';
import { useAuthProfile } from '@/composables/data/useAuth';
import { useReadRecentProfileLocations } from '@/composables/data/useLocations';
import { getLocationImages, type Image } from '@/domain/image';
import MenuSidebar from './menu/MenuSidebar.vue';
import type { RecentLocationFilter } from '@/domain/location';

defineEmits<{
    logout: [];
    'click:search': [];
    'click:filters': [];
}>();

const route = useRoute();

const { data: profile, isLoading: profileIsLoading } = useAuthProfile();

const profileId = computed<string | null>(() => {
    return profile.value?.id ?? null;
});

const filters = ref<RecentLocationFilter>({
    maxCount: 3,
});

const { data: recentLocations } = useReadRecentProfileLocations(profileId, filters);

const recentLocationImages = computed<Image[] | undefined>(() =>
    getLocationImages(recentLocations.value),
);

const showMenu = ref<boolean>(false);

const isLocationsActive = computed(() => {
    const name = route.name?.toString() || '';
    return name === 'locations' || name === 'locations.detail';
});

const isReservationsActive = computed(() => {
    const name = route.name?.toString() || '';
    const hash = route.hash;
    return name === 'profile' && hash === '#reservations';
});

const isManageActive = computed(() => {
    const name = route.name?.toString() || '';
    return name.startsWith('manage.') || name.startsWith('admin.');
});
</script>

<template>
    <div class="header">
        <div class="header__outer">
            <RouterLink :to="{ name: 'locations' }" class="header__logo-link">
                <Logo />
            </RouterLink>

            <nav class="header__actions">
                <Button @click="$emit('click:search')" rounded>
                    <template #icon>
                        <FontAwesomeIcon :icon="faSearch" />
                    </template>
                </Button>

                <RouterLink v-if="profile" :to="{ name: 'profile' }" class="header__profile-link">
                    <EntityAvatar class="h-10 w-10" :image="profile.avatar?.url" circle />
                </RouterLink>

                <RouterLink v-else :to="{ name: 'auth' }">
                    <Button severity="contrast" rounded>
                        <template #icon>
                            <FontAwesomeIcon :icon="faUser" />
                        </template>
                    </Button>
                </RouterLink>

                <Button severity="contrast" @click="showMenu = !showMenu" rounded>
                    <template #icon>
                        <FontAwesomeIcon :icon="faBars" />
                    </template>
                </Button>

                <Teleport to="body">
                    <MenuSidebar
                        v-model:show="showMenu"
                        :loading="profileIsLoading"
                        :profile="profile"
                        :images="recentLocationImages">
                    </MenuSidebar>
                </Teleport>
            </nav>
        </div>

        <nav class="header__inner">
            <RouterLink
                :to="{ name: 'locations' }"
                class="header__nav__item"
                :class="{ active: isLocationsActive }">
                <img :src="map" alt="Map Illustration" />
                <span>Verkennen</span>
            </RouterLink>

            <RouterLink
                :to="{ name: 'profile', hash: '#reservations' }"
                class="header__nav__item"
                :class="{ active: isReservationsActive }">
                <img :src="calendar" alt="School Illustration" />
                <span>Reservaties</span>
            </RouterLink>

            <RouterLink
                :to="{ name: 'manage.dashboard' }"
                class="header__nav__item"
                :class="{ active: isManageActive }">
                <ImageStack class="header__nav__stack" :images="recentLocationImages" />
                <span>Beheren</span>
            </RouterLink>
        </nav>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.header {
    @apply relative flex flex-col rounded-xl;
    @apply mx-auto w-full items-center justify-center gap-4;

    .header__outer {
        @apply flex w-full items-center justify-between;

        .header__actions {
            @apply flex items-center gap-2;
        }
    }

    .header__inner {
        @apply w-full md:max-w-[600px];
        @apply hidden md:absolute md:top-1/2 md:left-1/2 md:flex md:-translate-x-1/2 md:-translate-y-1/2;
        @apply items-center justify-center gap-6;

        .header__nav__item {
            @apply flex flex-col items-center justify-center gap-1.5;
            @apply transition-all duration-200;
            @apply cursor-pointer;
            @apply border-b-2 border-transparent hover:border-slate-300;
            @apply pb-0.5;

            &.active {
                @apply border-slate-900;
            }

            span {
                @apply text-sm font-medium;
            }

            img {
                @apply aspect-square h-8 w-8 rounded object-cover;
                @apply border border-slate-200;
            }

            .header__nav__stack {
                @apply h-8 w-8;
            }
        }
    }
}
</style>
