<script lang="ts" setup>
import LayoutSidebar from '@/layouts/LayoutSidebar.vue';
import LayoutSidebarItem from '@/layouts/LayoutSidebarItem.vue';
import { faBuilding, faInfoCircle, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
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
const router = useRouter();

const institutionIdNum = computed(() => +props.institutionId);
const enabled = computed(() => !Number.isNaN(institutionIdNum.value) && institutionIdNum.value > 0);

const { data: institution, isLoading, error } = useReadInstitution(institutionIdNum, { enabled });

function goBack() {
    router.push({ name: 'manage' });
}
</script>

<template>
    <div class="container">
        <Transition name="slide-in-left" appear>
            <div class="container__sidebar">
                <LayoutSidebar
                    :title="institution?.name[locale]"
                    :loading="isLoading"
                    show-back-button
                    @click:back="goBack">
                    <LayoutSidebarItem
                        :loading="isLoading"
                        :to="{ name: 'manage.institution.overview', params: { institutionId } }"
                        :active="route.name === 'manage.institution.overview'">
                        <template #img>
                            <FontAwesomeIcon :icon="faInfoCircle" />
                        </template>
                        <template #text>Overzicht</template>
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

                    <LayoutSidebarItem
                        :loading="isLoading"
                        :to="{ name: 'manage.institution.members', params: { institutionId } }"
                        :active="route.name === 'manage.institution.members'">
                        <template #img>
                            <FontAwesomeIcon :icon="faUsers" />
                        </template>
                        <template #text>Leden</template>
                    </LayoutSidebarItem>
                </LayoutSidebar>
            </div>
        </Transition>

        <Transition name="fade-slide-up" appear>
            <main class="container__main">
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
    @apply col-span-1;
}

.container__main {
    @apply col-span-3 lg:pl-12;
}
</style>
