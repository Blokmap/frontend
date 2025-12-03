<script lang="ts" setup>
import Callout from '@/components/shared/molecules/Callout.vue';
import ImageStack from '@/components/shared/molecules/ImageStack.vue';
import EntityAvatar from '@/components/shared/molecules/avatar/EntityAvatar.vue';
import LayoutSidebar from '@/layouts/LayoutSidebar.vue';
import LayoutSidebarItem from '@/layouts/LayoutSidebarItem.vue';
import { faBuilding, faCity, faHome } from '@fortawesome/free-solid-svg-icons';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import {
    useReadProfileAuthorityMemberships,
    useReadProfileInstitutionMemberships,
    useReadProfileLocationMemberships,
} from '@/composables/data/useMembers';
import { useReadProfile } from '@/composables/data/useProfile';
import { getLocationImages } from '@/domain/image';
import ManagementLoader from './ManagementLoader.vue';
import ManagementLoaderError from './ManagementLoaderError.vue';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    authProfile: Profile;
    profileId?: string;
}>();

const { locale } = useI18n();

const route = useRoute();
const router = useRouter();

const profileId = computed<string>(() => {
    return props.profileId || props.authProfile.id;
});

const isOtherProfile = computed(() => {
    return (
        props.authProfile.isAdmin && !!props.profileId && props.profileId !== props.authProfile.id
    );
});

const {
    data: targetProfile,
    isLoading: isLoadingProfile,
    error,
} = useReadProfile(profileId, {
    enabled: isOtherProfile,
});

const profile = computed<Profile>(() => {
    return targetProfile.value ?? props.authProfile;
});

const { data: locationMemberships, isLoading: isLoadingLocations } =
    useReadProfileLocationMemberships(profileId);

const { data: authorityMemberships, isLoading: isLoadingAuthorities } =
    useReadProfileAuthorityMemberships(profileId);

const { data: institutionMemberships, isLoading: isLoadingInstitutions } =
    useReadProfileInstitutionMemberships(profileId);

const isLoading = computed(() => {
    return isLoadingLocations.value || isLoadingAuthorities.value || isLoadingInstitutions.value;
});

const locationImages = computed(() => {
    const locations = locationMemberships.value?.map((m) => m.location) ?? [];
    return getLocationImages(locations);
});

function goBack() {
    router.push({ name: 'profile' });
}
</script>

<template>
    <div class="container">
        <Transition name="slide-in-left" appear>
            <div class="container__sidebar">
                <LayoutSidebar title="Beheer" show-back-button @click:back="goBack">
                    <div class="sidebar__nav-group">
                        <LayoutSidebarItem
                            :loading="isLoading"
                            :to="{
                                name: 'manage.dashboard',
                                params: { profileId: props.profileId },
                            }"
                            :active="route.name === 'manage.dashboard'">
                            <template #img>
                                <EntityAvatar
                                    class="h-full w-full"
                                    :image="profile.avatar?.url"
                                    :icon="faHome">
                                </EntityAvatar>
                            </template>
                            <template #text>Dashboard</template>
                        </LayoutSidebarItem>

                        <LayoutSidebarItem
                            :loading="isLoading"
                            :to="{
                                name: 'manage.locations',
                                params: { profileId: props.profileId },
                            }"
                            :active="route.name === 'manage.locations'">
                            <template #img>
                                <ImageStack :images="locationImages" />
                            </template>
                            <template #text>
                                {{ !isOtherProfile ? 'Mijn locaties' : 'Locaties' }}
                                <span v-if="locationMemberships" class="count">
                                    ({{ locationMemberships.length }})
                                </span>
                            </template>
                        </LayoutSidebarItem>
                    </div>

                    <template v-if="isLoading || institutionMemberships?.length">
                        <h3 class="sidebar__section-title">Organisaties</h3>

                        <div class="sidebar__nav-group">
                            <template v-if="isLoadingInstitutions">
                                <LayoutSidebarItem loading />
                                <LayoutSidebarItem loading />
                            </template>
                            <LayoutSidebarItem
                                v-else
                                v-for="m in institutionMemberships"
                                :key="m.institution.id"
                                :to="{
                                    name: 'manage.institution',
                                    params: { institutionId: m.institution.id },
                                }">
                                <template #img>
                                    <EntityAvatar
                                        class="h-full w-full"
                                        :image="m.institution.logo?.url"
                                        :icon="faCity">
                                    </EntityAvatar>
                                </template>
                                <template #text>{{ m.institution.name[locale] }}</template>
                            </LayoutSidebarItem>
                        </div>
                    </template>

                    <template v-if="isLoading || authorityMemberships?.length">
                        <h3 class="sidebar__section-title">Groepen</h3>

                        <div class="sidebar__nav-group">
                            <template v-if="isLoadingAuthorities">
                                <LayoutSidebarItem loading />
                                <LayoutSidebarItem loading />
                            </template>
                            <LayoutSidebarItem
                                v-else
                                v-for="m in authorityMemberships"
                                :key="m.authority.id"
                                :to="{
                                    name: 'manage.authority',
                                    params: { authorityId: m.authority.id },
                                }">
                                <template #img>
                                    <EntityAvatar
                                        class="h-full w-full"
                                        :image="m.authority.logo?.url"
                                        :icon="faBuilding">
                                    </EntityAvatar>
                                </template>
                                <template #text>{{ m.authority.name }}</template>
                            </LayoutSidebarItem>
                        </div>
                    </template>
                </LayoutSidebar>
            </div>
        </Transition>

        <Transition name="fade-slide-up" appear>
            <main class="container__main">
                <ManagementLoader v-if="isLoadingProfile" />
                <RouterView
                    v-else-if="profile"
                    v-slot="{ Component, route }"
                    :profile="profile"
                    :is-other-profile="isOtherProfile">
                    <Transition name="fade-slide-up" mode="out-in">
                        <div :key="route.path">
                            <Callout
                                v-if="isOtherProfile && targetProfile"
                                severity="info"
                                class="mb-6">
                                Je bekijkt het beheer van
                                <strong
                                    >{{ targetProfile.firstName }}
                                    {{ targetProfile.lastName }} </strong
                                >.
                                <RouterLink
                                    :to="{
                                        name: 'manage.dashboard',
                                        params: { profileId: authProfile.id },
                                    }"
                                    class="underline hover:no-underline">
                                    Terug naar eigen beheer
                                </RouterLink>
                            </Callout>
                            <component :is="Component" />
                        </div>
                    </Transition>
                </RouterView>
                <ManagementLoaderError v-else :error="error" />
            </main>
        </Transition>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.container {
    @apply mx-auto grid w-full flex-1 grid-cols-1 lg:my-4 lg:max-w-[1420px] lg:grid-cols-4 lg:px-0;

    .container__main {
        @apply col-span-3 lg:pl-12;
    }

    .container__sidebar {
        @apply col-span-1;

        .sidebar__nav-group {
            @apply space-y-2;
        }

        .sidebar__section-title {
            @apply px-3 text-xs font-semibold tracking-wider text-slate-400 uppercase;
        }

        .sidebar__section-title {
            @apply px-3 text-xs font-semibold tracking-wider text-slate-400 uppercase;
        }
    }
}

.count {
    @apply ml-1 text-sm font-normal text-slate-400;
}
</style>
