<script setup lang="ts">
import Button from 'primevue/button';
import Logo from '@/components/atoms/Logo.vue';
import EntityAvatar from '@/components/molecules/avatar/EntityAvatar.vue';
import LocationSearch from '@/components/molecules/location/search/LocationSearchButton.vue';
import PublicHeaderMenuButton from '@/components/organisms/layouts/public/PublicHeaderMenuButton.vue';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { RouterLink } from 'vue-router';
import { useAuthProfile } from '@/composables/data/useAuth';

defineEmits<{
    logout: [];
    'click:search': [];
}>();

const { data: profile, isLoading: profileIsLoading } = useAuthProfile();
</script>

<template>
    <div class="header">
        <div class="header__navigation">
            <RouterLink :to="{ name: 'locations' }" class="header__logo-link">
                <Logo />
            </RouterLink>

            <div class="header__actions">
                <RouterLink :to="{ name: 'profile' }" class="header__profile-link" v-if="profile">
                    <EntityAvatar class="h-12 w-12" :image="profile.avatar?.url" />
                </RouterLink>

                <RouterLink :to="{ name: 'auth' }" v-else>
                    <Button severity="contrast" rounded>
                        <template #icon>
                            <FontAwesomeIcon :icon="faUser" />
                        </template>
                    </Button>
                </RouterLink>

                <PublicHeaderMenuButton :loading="profileIsLoading" :profile="profile">
                </PublicHeaderMenuButton>
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
}

.header__navigation {
    @apply flex w-full items-center justify-between;
}

.header__search {
    @apply w-full md:max-w-[300px];
    @apply md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2;
}

.header__actions {
    @apply flex items-center gap-4;
}
</style>
