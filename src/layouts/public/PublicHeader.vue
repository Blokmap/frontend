<script setup lang="ts">
import Button from 'primevue/button';
import LocationSearch from '@/components/features/location/search/LocationSearchButton.vue';
import Logo from '@/components/shared/atoms/Logo.vue';
import EntityAvatar from '@/components/shared/molecules/avatar/EntityAvatar.vue';
import PublicHeaderMenuButton from '@/layouts/public/PublicHeaderMenuButton.vue';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { onMounted, onUnmounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useAuthProfile } from '@/composables/data/useAuth';

defineEmits<{
    (e: 'logout'): Promise<void>;
    (e: 'click:search'): void;
}>();

const { data: profile, isLoading: profileIsLoading } = useAuthProfile();

const isExpandedSearch = ref<boolean>(false);

function onEscapeClick(event: KeyboardEvent): void {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    isExpandedSearch.value = false;
}

onMounted(() => {
    window.addEventListener('keydown', onEscapeClick);
});

onUnmounted(() => {
    window.removeEventListener('keydown', onEscapeClick);
});
</script>

<template>
    <div class="header">
        <div class="header__navigation">
            <RouterLink :to="{ name: 'locations' }" class="header__logo-link">
                <Logo />
            </RouterLink>

            <div class="header__actions">
                <RouterLink :to="{ name: 'profile' }" class="header__profile-link" v-if="profile">
                    <EntityAvatar class="h-11 w-11" :image="profile.avatar?.url" />
                </RouterLink>

                <RouterLink :to="{ name: 'auth' }" v-else>
                    <Button severity="contrast" rounded>
                        <template #icon>
                            <FontAwesomeIcon :icon="faUser" />
                        </template>
                    </Button>
                </RouterLink>

                <PublicHeaderMenuButton :loading="profileIsLoading" :profile="profile" />
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
