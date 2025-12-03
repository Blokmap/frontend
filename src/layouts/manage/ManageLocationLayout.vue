<script lang="ts" setup>
import LayoutSidebar from '@/layouts/LayoutSidebar.vue';
import LayoutSidebarItem from '@/layouts/LayoutSidebarItem.vue';
import { faCalendarDays, faClock, faInfoCircle, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useReadLocation } from '@/composables/data/useLocations';
import { getLocationImageUrl, getLocationPlaceholderImage } from '@/domain/location';
import ManagementLoader from './ManagementLoader.vue';
import ManagementLoaderError from './ManagementLoaderError.vue';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    authProfile: Profile;
    locationId: string;
}>();

const route = useRoute();
const router = useRouter();

const locationIdNum = computed(() => +props.locationId);
const enabled = computed(() => !Number.isNaN(locationIdNum.value) && locationIdNum.value > 0);

const { data: location, isLoading, error } = useReadLocation(locationIdNum, { enabled });

const locationImage = computed(() => {
    if (!location.value) return undefined;

    if (location.value.images?.length) {
        return getLocationImageUrl(location.value);
    }

    return getLocationPlaceholderImage(location.value);
});

function goBack() {
    router.push({ name: 'manage.locations' });
}
</script>

<template>
    <div class="container">
        <Transition name="slide-in-left" appear>
            <div class="container__sidebar">
                <LayoutSidebar
                    :title="location?.name ?? 'Locatie'"
                    :subtitle="location?.authority?.name"
                    :loading="isLoading"
                    show-back-button
                    @click:back="goBack">
                    <template #banner-image>
                        <img v-if="locationImage" :src="locationImage" :alt="location?.name" />
                    </template>

                    <LayoutSidebarItem
                        :loading="isLoading"
                        :to="{ name: 'manage.location.info', params: { locationId } }"
                        :active="route.name === 'manage.location.info'">
                        <template #img>
                            <FontAwesomeIcon :icon="faInfoCircle" />
                        </template>
                        <template #text>Informatie</template>
                    </LayoutSidebarItem>

                    <LayoutSidebarItem
                        :loading="isLoading"
                        :to="{ name: 'manage.location.openings', params: { locationId } }"
                        :active="route.name === 'manage.location.openings'">
                        <template #img>
                            <FontAwesomeIcon :icon="faClock" />
                        </template>
                        <template #text>Openingsuren</template>
                    </LayoutSidebarItem>

                    <LayoutSidebarItem
                        v-if="isLoading || location?.isReservable"
                        :loading="isLoading"
                        :to="{ name: 'manage.location.reservations', params: { locationId } }"
                        :active="route.name === 'manage.location.reservations'">
                        <template #img>
                            <FontAwesomeIcon :icon="faCalendarDays" />
                        </template>
                        <template #text>Reservaties</template>
                    </LayoutSidebarItem>

                    <LayoutSidebarItem
                        :loading="isLoading"
                        :to="{ name: 'manage.location.members', params: { locationId } }"
                        :active="route.name === 'manage.location.members'">
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
                    v-else-if="location"
                    v-slot="{ Component, route }"
                    :location="location"
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
