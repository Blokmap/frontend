<script lang="ts" setup>
import ImageStack from '@/components/shared/molecules/ImageStack.vue';
import EntityAvatar from '@/components/shared/molecules/avatar/EntityAvatar.vue';
import ProfileAboutPage from '@/pages/profile/ProfileAboutPage.vue';
import ProfileReservationsPage from '@/pages/profile/ProfileReservationsPage.vue';
import { faSlidersH } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, ref, useTemplateRef } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthProfile } from '@/composables/data/useAuth';
import { useReadRecentProfileLocations } from '@/composables/data/useLocations';
import { useScrollSpy } from '@/composables/useScrollSpy';
import { getLocationImages } from '@/domain/image/imageHelpers';
import { type RecentLocationFilter } from '@/domain/location';
import LayoutSidebar from '../LayoutSidebar.vue';
import LayoutSidebarItem from '../LayoutSidebarItem.vue';
import type { Image } from '@/domain/image';

const route = useRoute();

const { data: profile } = useAuthProfile();

const filters = ref<RecentLocationFilter>({
    maxCount: 3,
});

const profileId = computed<string | null>(() => {
    return profile.value ? profile.value.id : null;
});

const { data: recentLocations } = useReadRecentProfileLocations(profileId, filters, {
    staleTime: Infinity,
});

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
    <div class="container">
        <Transition name="slide-in-left" appear>
            <Transition name="slide-down">
                <LayoutSidebar class="container__sidebar" title="Profiel">
                    <template v-if="profile" #default>
                        <div class="sidebar-nav-group">
                            <LayoutSidebarItem
                                :to="{ name: 'profile', hash: '#about' }"
                                :active="route.name === 'profile' && activeHash === '#about'"
                                :compact="false">
                                <template #img>
                                    <EntityAvatar
                                        class="h-full w-full"
                                        :image="profile.avatar?.url" />
                                </template>
                                <template #text>
                                    <span>Mijn Profiel</span>
                                </template>
                            </LayoutSidebarItem>
                            <LayoutSidebarItem
                                :to="{ name: 'profile', hash: '#reservations' }"
                                :active="route.name === 'profile' && activeHash === '#reservations'"
                                :compact="false">
                                <template #img>
                                    <ImageStack :images="recentLocationImages"> </ImageStack>
                                </template>
                                <template #text>
                                    <span>Mijn Reservaties</span>
                                </template>
                            </LayoutSidebarItem>
                            <LayoutSidebarItem :to="{ name: 'manage' }" :compact="false">
                                <template #img>
                                    <FontAwesomeIcon :icon="faSlidersH" />
                                </template>
                                <template #text>Mijn beheer</template>
                            </LayoutSidebarItem>
                        </div>
                    </template>
                </LayoutSidebar>
            </Transition>
        </Transition>
        <Transition name="fade-slide-up" appear>
            <main class="container__main" v-if="profile">
                <template v-if="route.name === 'profile'">
                    <section class="pt-6" id="about" ref="about">
                        <ProfileAboutPage :profile="profile" />
                    </section>
                    <section class="pt-6" id="reservations" ref="reservations">
                        <ProfileReservationsPage :profile="profile" />
                    </section>
                </template>
                <template v-else>
                    <RouterView :profile="profile" is-own-profile />
                </template>
            </main>
        </Transition>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.container {
    @apply mx-auto grid w-full flex-1 grid-cols-1 lg:my-4 lg:max-w-[1420px] lg:grid-cols-4 lg:px-0;
}

.container__sidebar {
    @apply col-span-1 lg:pr-12;
}

.container__main {
    @apply col-span-3 space-y-12 lg:pl-12;
}
</style>
