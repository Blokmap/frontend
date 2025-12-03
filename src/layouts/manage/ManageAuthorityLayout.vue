<script lang="ts" setup>
import EntityAvatar from '@/components/shared/molecules/avatar/EntityAvatar.vue';
import LayoutSidebar from '@/layouts/LayoutSidebar.vue';
import LayoutSidebarItem from '@/layouts/LayoutSidebarItem.vue';
import { faInfoCircle, faMapLocationDot, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useReadAuthority } from '@/composables/data/useAuthorities';
import ManagementLoader from './ManagementLoader.vue';
import ManagementLoaderError from './ManagementLoaderError.vue';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    authProfile: Profile;
    authorityId: string;
}>();

const route = useRoute();
const router = useRouter();

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

function goBack() {
    router.push({ name: 'manage' });
}
</script>

<template>
    <div class="container">
        <Transition name="slide-in-left" appear>
            <div class="container__sidebar">
                <LayoutSidebar
                    :title="authority?.name ?? 'Groep'"
                    :loading="isLoading"
                    show-back-button
                    @click:back="goBack">
                    <LayoutSidebarItem
                        :loading="isLoading"
                        :to="{ name: 'manage.authority.overview', params: { authorityId } }"
                        :active="route.name === 'manage.authority.overview'">
                        <template #img>
                            <EntityAvatar
                                :image="authority?.logo?.url"
                                :icon="faInfoCircle"
                                class="sidebar__avatar">
                            </EntityAvatar>
                        </template>
                        <template #text>Overzicht</template>
                    </LayoutSidebarItem>

                    <LayoutSidebarItem
                        :loading="isLoading"
                        :to="{ name: 'manage.authority.locations', params: { authorityId } }"
                        :active="route.name === 'manage.authority.locations'">
                        <template #img>
                            <FontAwesomeIcon :icon="faMapLocationDot" />
                        </template>
                        <template #text>Locaties</template>
                    </LayoutSidebarItem>

                    <LayoutSidebarItem
                        :loading="isLoading"
                        :to="{ name: 'manage.authority.members', params: { authorityId } }"
                        :active="route.name === 'manage.authority.members'">
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

.sidebar__avatar {
    @apply h-8 w-8 shrink-0 lg:h-10 lg:w-10;
}
</style>
