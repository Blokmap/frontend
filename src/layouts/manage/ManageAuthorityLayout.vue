<script lang="ts" setup>
import InstitutionBreadcrumb from '@/components/features/institution/InstitutionBreadcrumb.vue';
import LayoutContainer from '@/layouts/LayoutContainer.vue';
import LayoutSidebar from '@/layouts/sidebar/LayoutSidebar.vue';
import LayoutSidebarItem from '@/layouts/sidebar/LayoutSidebarItem.vue';
import LayoutSidebarSection from '@/layouts/sidebar/LayoutSidebarSection.vue';
import {
    faCog,
    faInfoCircle,
    faMapLocationDot,
    faUsers,
    faUserTag,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useReadAuthority } from '@/composables/data/useAuthorities';
import ManagementLoader from './ManagementLoader.vue';
import ManagementLoaderError from './ManagementLoaderError.vue';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    authProfile: Profile;
    authorityId: string;
}>();

const route = useRoute();

const authorityIdNum = computed(() => +props.authorityId);
const enabled = computed(() => !Number.isNaN(authorityIdNum.value) && authorityIdNum.value > 0);

const {
    data: authority,
    isLoading,
    error,
} = useReadAuthority(authorityIdNum, {
    enabled,
    includes: ['institution'],
});

const logoUrl = computed(() => authority.value?.logo?.url);
</script>

<template>
    <LayoutContainer sidebar-transition="slide-in-left" main-transition="fade-slide-up">
        <template #sidebar>
            <LayoutSidebar :title="authority?.name ?? 'Groep'" :logo="logoUrl" :loading="isLoading">
                <template #header>
                    <InstitutionBreadcrumb
                        v-if="authority"
                        :institution="authority?.institution"
                        editable>
                    </InstitutionBreadcrumb>
                </template>

                <LayoutSidebarSection title="Instellingen">
                    <LayoutSidebarItem
                        :loading="isLoading"
                        :to="{ name: 'manage.authority.info', params: { authorityId } }"
                        :active="route.name === 'manage.authority.info'">
                        <template #img>
                            <FontAwesomeIcon :icon="faInfoCircle" />
                        </template>
                        <template #text>Informatie</template>
                    </LayoutSidebarItem>

                    <LayoutSidebarItem
                        :loading="isLoading"
                        :to="{ name: 'manage.authority.settings', params: { authorityId } }"
                        :active="route.name === 'manage.authority.settings'">
                        <template #img>
                            <FontAwesomeIcon :icon="faCog" />
                        </template>
                        <template #text>Instellingen</template>
                    </LayoutSidebarItem>
                </LayoutSidebarSection>

                <LayoutSidebarSection title="Relaties">
                    <LayoutSidebarItem
                        :loading="isLoading"
                        :to="{ name: 'manage.authority.locations', params: { authorityId } }"
                        :active="route.name === 'manage.authority.locations'">
                        <template #img>
                            <FontAwesomeIcon :icon="faMapLocationDot" />
                        </template>
                        <template #text>Locaties</template>
                    </LayoutSidebarItem>
                </LayoutSidebarSection>

                <LayoutSidebarSection title="Toegangscontrole">
                    <LayoutSidebarItem
                        :loading="isLoading"
                        :to="{ name: 'manage.authority.members', params: { authorityId } }"
                        :active="route.name === 'manage.authority.members'">
                        <template #img>
                            <FontAwesomeIcon :icon="faUsers" />
                        </template>
                        <template #text>Leden</template>
                    </LayoutSidebarItem>

                    <LayoutSidebarItem
                        :loading="isLoading"
                        :to="{ name: 'manage.authority.roles', params: { authorityId } }"
                        :active="route.name === 'manage.authority.roles'">
                        <template #img>
                            <FontAwesomeIcon :icon="faUserTag" />
                        </template>
                        <template #text>Rollen</template>
                    </LayoutSidebarItem>
                </LayoutSidebarSection>
            </LayoutSidebar>
        </template>

        <template #main>
            <ManagementLoader v-if="isLoading" />
            <RouterView
                v-else-if="authority"
                v-slot="{ Component, route }"
                :authority="authority"
                :auth-profile="authProfile"
                :error="error">
                <Transition name="fade-slide-up" mode="out-in">
                    <component :is="Component" :key="route.path" />
                </Transition>
            </RouterView>
            <ManagementLoaderError v-else :error="error" />
        </template>
    </LayoutContainer>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.sidebar__avatar {
    @apply h-8 w-8 shrink-0 lg:h-10 lg:w-10;
}
</style>
