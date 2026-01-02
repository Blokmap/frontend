<script setup lang="ts">
import Button from 'primevue/button';
import Logo from '@/components/atoms/Logo.vue';
import EntityAvatar from '@/components/molecules/avatar/EntityAvatar.vue';
import LocationSearch from '@/components/molecules/location/search/LocationSearchButton.vue';
import { faBars, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useAuthProfile } from '@/composables/data/useAuth';
import { useReadRecentProfileLocations } from '@/composables/data/useLocations';
import { getLocationImages, type Image } from '@/domain/image';
import MenuSidebar from './menu/MenuSidebar.vue';
import type { RecentLocationFilter } from '@/domain/location';

defineEmits<{
    logout: [];
    'click:search': [];
}>();

const { data: profile, isLoading: profileIsLoading } = useAuthProfile();

const profileId = computed<string | null>(() => {
    return profile.value?.id ?? null;
});

const filters = ref<RecentLocationFilter>({
    maxCount: 3,
});

const { data: recentLocations } = useReadRecentProfileLocations(profileId, filters);

const recentLocationImages = computed<Image[] | undefined>(() =>
    getLocationImages(recentLocations.value),
);

const showMenu = ref<boolean>(false);
</script>

<template>
    <div class="header">
        <div class="header__navigation">
            <RouterLink :to="{ name: 'locations' }" class="header__logo-link">
                <Logo />
            </RouterLink>

            <div class="header__actions">
                <RouterLink :to="{ name: 'profile' }" class="header__profile-link" v-if="profile">
                    <EntityAvatar class="h-10 w-10" :image="profile.avatar?.url" />
                </RouterLink>

                <RouterLink :to="{ name: 'auth' }" v-else>
                    <Button severity="contrast" rounded>
                        <template #icon>
                            <FontAwesomeIcon :icon="faUser" />
                        </template>
                    </Button>
                </RouterLink>

                <Button severity="contrast" @click="showMenu = !showMenu" rounded>
                    <template #icon>
                        <FontAwesomeIcon :icon="faBars" />
                    </template>
                </Button>

                <Teleport to="body">
                    <MenuSidebar
                        v-model:show="showMenu"
                        :loading="profileIsLoading"
                        :profile="profile"
                        :images="recentLocationImages">
                    </MenuSidebar>
                </Teleport>
            </div>
        </div>

        <div class="header__search">
            <LocationSearch @click:search="$emit('click:search')" />
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.header {
    @apply relative flex flex-col rounded-xl;
    @apply mx-auto w-full items-center justify-center gap-4;

    .header__navigation {
        @apply flex w-full items-center justify-between;
    }

    .header__search {
        @apply w-full md:max-w-[300px];
        @apply md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2;
    }

    .header__actions {
        @apply flex items-center gap-2;
    }
}
</style>
