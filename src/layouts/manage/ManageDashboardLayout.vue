<script lang="ts" setup>
import Button from 'primevue/button';
import Callout from '@/components/shared/molecules/Callout.vue';
import ImageStack from '@/components/shared/molecules/ImageStack.vue';
import EntityAvatar from '@/components/shared/molecules/avatar/EntityAvatar.vue';
import LayoutContainer from '@/layouts/LayoutContainer.vue';
import LayoutSidebar from '@/layouts/sidebar/LayoutSidebar.vue';
import LayoutSidebarItem from '@/layouts/sidebar/LayoutSidebarItem.vue';
import LayoutSidebarSection from '@/layouts/sidebar/LayoutSidebarSection.vue';
import { faBuilding, faCity, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
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
    const baseLoading =
        isLoadingLocations.value && isLoadingAuthorities.value && isLoadingInstitutions.value;

    // If viewing another profile, also wait for that profile to load
    if (isOtherProfile.value) {
        return baseLoading && isLoadingProfile.value;
    }

    return baseLoading;
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
    <LayoutContainer :loading="isLoading">
        <template #sidebar>
            <LayoutSidebar title="Beheer" @click:back="goBack" show-back-button>
                <LayoutSidebarSection>
                    <!-- <LayoutSidebarItem
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
                    </LayoutSidebarItem> -->

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
                </LayoutSidebarSection>

                <LayoutSidebarSection title="Organisaties">
                    <template v-if="isLoadingInstitutions">
                        <LayoutSidebarItem loading />
                        <LayoutSidebarItem loading />
                    </template>
                    <LayoutSidebarItem
                        v-else-if="institutionMemberships?.length"
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
                    <template v-else>
                        <div>
                            <p>
                                Je bent nog geen lid van een organisatie. Maak een organisatie aan
                                voor je bedrijf of instelling om bloklocaties te beheren.
                            </p>
                            <Button>
                                <span>Nieuwe organisatie maken</span>
                                <FontAwesomeIcon :icon="faPlus" />
                            </Button>
                        </div>
                    </template>
                </LayoutSidebarSection>

                <LayoutSidebarSection
                    title="Groepen"
                    v-if="isLoadingAuthorities || authorityMemberships?.length">
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
                </LayoutSidebarSection>
            </LayoutSidebar>
        </template>

        <template #main>
            <ManagementLoader v-if="isLoading" />
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
                            <strong>
                                {{ targetProfile.firstName }}
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
            <ManagementLoaderError v-else :errors="[error]" />
        </template>
    </LayoutContainer>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.count {
    @apply ml-1 text-sm font-normal text-slate-400;
}
</style>
