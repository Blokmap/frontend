<script lang="ts" setup>
import InstitutionSelector from '@/components/features/institution/InstitutionSelector.vue';
import ImageStack from '@/components/shared/molecules/ImageStack.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthProfile } from '@/composables/data/useAuth';
import {
    useReadProfileAuthorityMemberships,
    useReadProfileInstitutionMemberships,
    useReadProfileLocationMemberships,
} from '@/composables/data/useMembers';
import { getLocationImages } from '@/domain/image';
import LayoutContainer from '../LayoutContainer.vue';
import LayoutMain from '../LayoutMain.vue';
import LayoutSidebar from '../LayoutSidebar.vue';
import LayoutSidebarItem from '../LayoutSidebarItem.vue';
import type { InstitutionAuthorityMemberships } from '@/domain/member';

const { data: profile } = useAuthProfile();
const { name: routeName } = useRoute();

const profileId = computed(() => profile.value?.id ?? null);

const { data: locationMemberships } = useReadProfileLocationMemberships(profileId);
const { data: institutionMemberships } = useReadProfileInstitutionMemberships(profileId);
const { data: authorityMemberships } = useReadProfileAuthorityMemberships(profileId, {
    includes: ['institution'],
});

const locationImages = computed(() =>
    getLocationImages(locationMemberships.value?.map((m) => m.location) ?? []),
);

const institutions = computed<InstitutionAuthorityMemberships[] | undefined>(() => {
    if (!authorityMemberships.value || !institutionMemberships.value) {
        return undefined;
    }

    const membershipMap = new Map<number, InstitutionAuthorityMemberships>();

    for (const membership of institutionMemberships.value) {
        membershipMap.set(membership.institution.id, {
            ...membership,
            authorities: [],
        });
    }

    for (const authMembership of authorityMemberships.value) {
        const institution = authMembership.authority.institution;
        const key = institution?.id;

        if (!key) {
            continue;
        }

        if (membershipMap.has(key)) {
            membershipMap.get(key)!.authorities.push(authMembership);
        } else {
            membershipMap.set(key, {
                institution,
                role: null,
                authorities: [authMembership],
            });
        }
    }

    return Array.from(membershipMap.values());
});
</script>

<template>
    <LayoutContainer>
        <Transition name="slide-in-left" appear>
            <LayoutSidebar title="Beheermodus">
                <LayoutSidebarItem
                    :active="routeName === 'manage.locations'"
                    :to="{ name: 'manage.locations' }">
                    <template #img>
                        <ImageStack :images="locationImages" />
                    </template>
                    <template #text>
                        <span>Mijn locaties</span>
                    </template>
                </LayoutSidebarItem>

                <div class="!my-12 border-t-2 border-slate-200"></div>

                <InstitutionSelector :institutions="institutions" />
            </LayoutSidebar>
        </Transition>
        <Transition name="fade-slide-up" appear>
            <LayoutMain class="main">
                <section>
                    <RouterView />
                </section>
            </LayoutMain>
        </Transition>
    </LayoutContainer>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
