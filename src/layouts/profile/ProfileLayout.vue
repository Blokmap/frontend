<script lang="ts" setup>
import ProfileAvatar from '@/components/features/profile/avatar/ProfileAvatar.vue';
import ImageStack from '@/components/shared/molecules/ImageStack.vue';
import ProfileAboutPage from '@/pages/profile/ProfileAboutPage.vue';
import ProfileReservationsPage from '@/pages/profile/ProfileReservationsPage.vue';
import { faCalendarAlt, faSlidersH } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, useTemplateRef } from 'vue';
import { useAuthProfile } from '@/composables/data/useAuth';
import { useReadRecentProfileLocations } from '@/composables/data/useLocations';
import { useScrollSpy } from '@/composables/useScrollSpy';
import { getLocationImages } from '@/domain/image/imageHelpers';
import type { Image } from '@/domain/image';

const { data: profile } = useAuthProfile();

const { data: recentLocations } = useReadRecentProfileLocations(
    computed(() => profile.value?.id ?? null),
    computed(() => ({ maxCount: 3 })),
);

const aboutSection = useTemplateRef<HTMLElement | null>('about');
const reservationsSection = useTemplateRef<HTMLElement | null>('reservations');

const { activeHash } = useScrollSpy('#about', [
    { element: aboutSection, hash: '#about' },
    { element: reservationsSection, hash: '#reservations' },
]);

const recentLocationImages = computed<Image[] | undefined>(() =>
    getLocationImages(recentLocations.value),
);
</script>

<template>
    <div class="profile-layout">
        <Transition name="slide-in-left" appear>
            <aside class="sidebar">
                <h1 class="sidebar__title">Profiel</h1>
                <nav class="sidebar__nav">
                    <template v-if="profile">
                        <RouterLink
                            :to="{ name: 'profile', hash: '#about' }"
                            class="sidebar__nav-item"
                            :class="{ 'active-item': activeHash === '#about' }">
                            <ProfileAvatar class="sidebar__nav-item__img" :profile="profile" />
                            <span class="sidebar__nav-item__text">Mijn Profiel</span>
                        </RouterLink>
                        <RouterLink
                            :to="{ name: 'profile', hash: '#reservations' }"
                            class="sidebar__nav-item"
                            :class="{ 'active-item': activeHash === '#reservations' }">
                            <span class="sidebar__nav-item__img">
                                <ImageStack
                                    v-if="!recentLocationImages || recentLocationImages.length > 0"
                                    :images="recentLocationImages" />
                                <FontAwesomeIcon v-else :icon="faCalendarAlt" />
                            </span>
                            <span class="sidebar__nav-item__text">Mijn Reservaties</span>
                        </RouterLink>
                        <RouterLink
                            :to="{
                                name: 'dashboard.profiles.detail.overview',
                                params: { profileId: profile.id },
                            }"
                            class="sidebar__nav-item"
                            active-class="active-item">
                            <span class="sidebar__nav-item__img">
                                <FontAwesomeIcon :icon="faSlidersH" />
                            </span>
                            <span class="sidebar__nav-item__text">Beheermodus</span>
                        </RouterLink>
                    </template>
                </nav>
            </aside>
        </Transition>
        <Transition name="fade-slide-up" appear>
            <main class="main">
                <section id="about" ref="about">
                    <ProfileAboutPage />
                </section>
                <section id="reservations" ref="reservations">
                    <ProfileReservationsPage />
                </section>
            </main>
        </Transition>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.profile-layout {
    @apply mx-auto my-4 grid max-w-[1080px] grid-cols-1 lg:grid-cols-3;
}

.sidebar {
    @apply col-span-1 space-y-6;
    @apply pt-6 lg:pt-0 lg:pr-12;
    @apply border-t-2 border-slate-200 lg:border-t-0 lg:border-r-2;
    @apply order-last lg:order-first;

    .sidebar__title {
        @apply hidden text-3xl font-extrabold lg:block;
    }

    .sidebar__nav {
        @apply grid grid-cols-2 gap-2 lg:block lg:space-y-2;
    }

    .sidebar__nav-item {
        @apply flex items-center gap-3 px-4 py-3;
        @apply cursor-pointer rounded-lg transition-all hover:bg-slate-100;

        &.active-item {
            @apply bg-slate-100 dark:bg-gray-700;
        }

        .sidebar__nav-item__img {
            @apply flex h-12 w-12 shrink-0 items-center justify-center text-xl;
            @apply shadow-playful rounded-full bg-slate-100 object-fill text-slate-700;
            --shadow-color: var(--color-slate-300);
        }

        .sidebar__nav-item__text {
            @apply font-bold;
        }
    }
}

.main {
    @apply col-span-2 space-y-12 lg:pl-12;
}
</style>
