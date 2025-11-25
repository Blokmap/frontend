<script lang="ts" setup>
import ProfileAvatar from '@/components/features/profile/avatar/ProfileAvatar.vue';
import ImageStack from '@/components/shared/molecules/ImageStack.vue';
import ProfileAboutPage from '@/pages/profile/ProfileAboutPage.vue';
import ProfileReservationsPage from '@/pages/profile/ProfileReservationsPage.vue';
import { faSlidersH } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, useTemplateRef } from 'vue';
import { useAuthProfile } from '@/composables/data/useAuth';
import { useReadRecentProfileLocations } from '@/composables/data/useLocations';
import { useScrollSpy } from '@/composables/useScrollSpy';
import { getLocationImages } from '@/domain/image/imageHelpers';
import LayoutContainer from '../LayoutContainer.vue';
import LayoutMain from '../LayoutMain.vue';
import LayoutSidebar from '../LayoutSidebar.vue';
import LayoutSidebarItem from '../LayoutSidebarItem.vue';
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
    <LayoutContainer>
        <Transition name="slide-in-left" appear>
            <Transition name="slide-down">
                <LayoutSidebar class="sidebar" title="Profiel">
                    <template v-if="profile" #default>
                        <LayoutSidebarItem
                            :to="{ name: 'profile', hash: '#about' }"
                            :active="activeHash === '#about'">
                            <template #img>
                                <ProfileAvatar class="h-full w-full" :profile="profile" />
                            </template>
                            <template #text>
                                <span>Mijn Profiel</span>
                            </template>
                        </LayoutSidebarItem>
                        <LayoutSidebarItem
                            :to="{ name: 'profile', hash: '#reservations' }"
                            :active="activeHash === '#reservations'">
                            <template #img>
                                <ImageStack :images="recentLocationImages"> </ImageStack>
                            </template>
                            <template #text>
                                <span>Mijn Reservaties</span>
                            </template>
                        </LayoutSidebarItem>
                        <LayoutSidebarItem :to="{ name: 'manage' }">
                            <template #img>
                                <FontAwesomeIcon :icon="faSlidersH" />
                            </template>
                            <template #text>
                                <span>Beheermodus</span>
                            </template>
                        </LayoutSidebarItem>
                    </template>
                </LayoutSidebar>
            </Transition>
        </Transition>
        <Transition name="fade-slide-up" appear>
            <LayoutMain class="main">
                <section class="pt-6" id="about" ref="about">
                    <ProfileAboutPage />
                </section>
                <section class="pt-6" id="reservations" ref="reservations">
                    <ProfileReservationsPage />
                </section>
            </LayoutMain>
        </Transition>
    </LayoutContainer>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.sidebar {
    @apply col-span-1;
}

.main {
    @apply col-span-2;
}
</style>
