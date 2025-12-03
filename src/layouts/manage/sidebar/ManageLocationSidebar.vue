<script lang="ts" setup>
import LayoutSidebar from '@/layouts/LayoutSidebar.vue';
import LayoutSidebarItem from '@/layouts/LayoutSidebarItem.vue';
import { faCalendarDays, faClock, faInfoCircle, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useReadLocation } from '@/composables/data/useLocations';
import { getLocationImageUrl, getLocationPlaceholderImage } from '@/domain/location';

const props = defineProps<{
    locationId: string;
}>();

const route = useRoute();
const router = useRouter();

const locationIdNum = computed(() => +props.locationId);
const enabled = computed(() => !Number.isNaN(locationIdNum.value) && locationIdNum.value > 0);

const { data: location, isLoading } = useReadLocation(locationIdNum, { enabled });

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
    <LayoutSidebar
        :title="location?.name ?? 'Locatie'"
        :subtitle="location?.authority?.name"
        :loading="isLoading"
        show-back-button
        @click:back="goBack">
        <template #banner-image>
            <img v-if="locationImage" :src="locationImage" :alt="location?.name" />
        </template>

        <div class="sidebar-nav-group">
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
        </div>
    </LayoutSidebar>
</template>
