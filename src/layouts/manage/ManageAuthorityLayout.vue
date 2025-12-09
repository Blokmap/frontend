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
import { useReadAuthorityMemberPermissions } from '@/composables/data/useMembers';
import ManagementLoader from './ManagementLoader.vue';
import ManagementLoaderError from './ManagementLoaderError.vue';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    authProfile: Profile;
    authorityId: string;
}>();

const route = useRoute();

const authorityId = computed(() => {
    return +props.authorityId;
});

const {
    data: authority,
    isLoading: isLoadingAuthority,
    error: authorityError,
} = useReadAuthority(authorityId, {
    includes: ['institution'],
});

const {
    data: permissions,
    isLoading: isLoadingPermissions,
    error: permissionsError,
} = useReadAuthorityMemberPermissions(authorityId, props.authProfile.id);

const isLoading = computed<boolean>(() => {
    return isLoadingAuthority.value || isLoadingPermissions.value;
});
</script>

<template>
    <LayoutContainer>
        <template #sidebar>
            <LayoutSidebar
                :title="authority?.name"
                :logo="authority?.logo?.url"
                :loading="isLoading">
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
                :permissions="permissions">
                <Transition name="fade-slide-up" mode="out-in">
                    <component :is="Component" :key="route.path" />
                </Transition>
            </RouterView>
            <ManagementLoaderError v-else :error="[authorityError, permissionsError]" />
        </template>
    </LayoutContainer>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.sidebar__avatar {
    @apply h-8 w-8 shrink-0 lg:h-10 lg:w-10;
}
</style>
