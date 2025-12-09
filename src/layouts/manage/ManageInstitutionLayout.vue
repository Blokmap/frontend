<script lang="ts" setup>
import InstitutionBreadcrumb from '@/components/features/institution/InstitutionBreadcrumb.vue';
import LayoutContainer from '@/layouts/LayoutContainer.vue';
import LayoutSidebar from '@/layouts/sidebar/LayoutSidebar.vue';
import LayoutSidebarItem from '@/layouts/sidebar/LayoutSidebarItem.vue';
import LayoutSidebarSection from '@/layouts/sidebar/LayoutSidebarSection.vue';
import {
    faBuilding,
    faCog,
    faInfoCircle,
    faUsers,
    faUserTag,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { useReadInstitution } from '@/composables/data/useInstitutions';
import ManagementLoader from './ManagementLoader.vue';
import ManagementLoaderError from './ManagementLoaderError.vue';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    authProfile: Profile;
    institutionId: string;
}>();

const { locale } = useI18n();

const route = useRoute();

const institutionIdNum = computed(() => +props.institutionId);
const enabled = computed(() => !Number.isNaN(institutionIdNum.value) && institutionIdNum.value > 0);

const { data: institution, isLoading, error } = useReadInstitution(institutionIdNum, { enabled });
</script>

<template>
    <LayoutContainer>
        <template #sidebar>
            <LayoutSidebar
                :title="institution?.name[locale]"
                :logo="institution?.logo?.url"
                :loading="isLoading">
                <template #header>
                    <InstitutionBreadcrumb :institution="institution" :loading="isLoading">
                    </InstitutionBreadcrumb>
                </template>

                <LayoutSidebarSection title="Instellingen">
                    <LayoutSidebarItem
                        :loading="isLoading"
                        :to="{ name: 'manage.institution.info', params: { institutionId } }"
                        :active="route.name === 'manage.institution.info'">
                        <template #img>
                            <FontAwesomeIcon :icon="faInfoCircle" />
                        </template>
                        <template #text>Informatie</template>
                    </LayoutSidebarItem>

                    <LayoutSidebarItem
                        :loading="isLoading"
                        :to="{ name: 'manage.institution.settings', params: { institutionId } }"
                        :active="route.name === 'manage.institution.settings'">
                        <template #img>
                            <FontAwesomeIcon :icon="faCog" />
                        </template>
                        <template #text>Instellingen</template>
                    </LayoutSidebarItem>
                </LayoutSidebarSection>

                <LayoutSidebarSection title="Structuur">
                    <LayoutSidebarItem
                        :loading="isLoading"
                        :to="{ name: 'manage.institution.profiles', params: { institutionId } }"
                        :active="route.name === 'manage.institution.profiles'">
                        <template #img>
                            <FontAwesomeIcon :icon="faUsers" />
                        </template>
                        <template #text>Leden</template>
                    </LayoutSidebarItem>

                    <LayoutSidebarItem
                        :loading="isLoading"
                        :to="{ name: 'manage.institution.authorities', params: { institutionId } }"
                        :active="route.name === 'manage.institution.authorities'">
                        <template #img>
                            <FontAwesomeIcon :icon="faBuilding" />
                        </template>
                        <template #text>Groepen</template>
                    </LayoutSidebarItem>
                </LayoutSidebarSection>

                <LayoutSidebarSection title="Toegangscontrole">
                    <LayoutSidebarItem
                        :loading="isLoading"
                        :to="{ name: 'manage.institution.members', params: { institutionId } }"
                        :active="route.name === 'manage.institution.members'">
                        <template #img>
                            <FontAwesomeIcon :icon="faUserTag" />
                        </template>
                        <template #text>Beheerders</template>
                    </LayoutSidebarItem>

                    <LayoutSidebarItem
                        :loading="isLoading"
                        :to="{ name: 'manage.institution.roles', params: { institutionId } }"
                        :active="route.name === 'manage.institution.roles'">
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
                v-else-if="institution"
                v-slot="{ Component, route }"
                :institution="institution"
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
