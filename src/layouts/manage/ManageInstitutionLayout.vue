<script lang="ts" setup>
import LayoutContainer from '@/layouts/LayoutContainer.vue';
import LayoutSidebar from '@/layouts/sidebar/LayoutSidebar.vue';
import LayoutSidebarItem from '@/layouts/sidebar/LayoutSidebarItem.vue';
import LayoutSidebarSection from '@/layouts/sidebar/LayoutSidebarSection.vue';
import {
    faBuilding,
    faCog,
    faInfoCircle,
    faMapLocationDot,
    faUsers,
    faUserTag,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useReadInstitution } from '@/composables/data/useInstitutions';
import Loader from '../Loader.vue';
import LoaderError from '../LoaderError.vue';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    authProfile: Profile;
    institutionId: string;
}>();

const { locale } = useI18n();
const route = useRoute();
const router = useRouter();

const institutionId = computed(() => +props.institutionId);

const { data: institution, isLoading, error } = useReadInstitution(institutionId);

function goBack() {
    router.push({ name: 'manage.dashboard' });
}
</script>

<template>
    <LayoutContainer :loading="isLoading">
        <template #sidebar>
            <LayoutSidebar
                :title="institution?.name[locale]"
                :logo="institution?.logo?.url"
                :loading="isLoading"
                show-back-button
                back-button-text="Terug naar dashboard"
                @click:back="goBack">
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
                        :active="route.name === 'manage.institution.settings'"
                        disabled>
                        <template #img>
                            <FontAwesomeIcon :icon="faCog" />
                        </template>
                        <template #text>Instellingen</template>
                    </LayoutSidebarItem>
                </LayoutSidebarSection>

                <LayoutSidebarSection title="Structuur">
                    <LayoutSidebarItem
                        :loading="isLoading"
                        :to="{ name: 'manage.institution.locations', params: { institutionId } }"
                        :active="route.name === 'manage.institution.locations'">
                        <template #img>
                            <FontAwesomeIcon :icon="faMapLocationDot" />
                        </template>
                        <template #text>Locaties</template>
                    </LayoutSidebarItem>

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
            <Loader v-if="isLoading" />
            <RouterView
                v-else-if="institution"
                v-slot="{ Component, route }"
                :institution="institution"
                :auth-profile="authProfile">
                <Transition name="fade-slide-up" mode="out-in">
                    <component :is="Component" :key="route.path" />
                </Transition>
            </RouterView>
            <LoaderError v-else :errors="[error]" />
        </template>
    </LayoutContainer>
</template>
