<script setup lang="ts">
import LocationSearch from '@/components/features/location/LocationSearch.vue';
import UserAvatar from '@/components/shared/UserAvatar.vue';
import type { Profile } from '@/types/model/Profile';
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Button from 'primevue/button';
import { RouterLink } from 'vue-router';

defineProps<{
    profile?: Profile | null;
    profileIsLoading?: boolean;
    logoutIsLoading?: boolean;
}>();

defineEmits<{
    (e: 'logout'): Promise<void>;
}>();

const navigation = [
    {
        name: 'Home',
        link: { name: 'home' },
    },
    {
        name: 'Locations',
        link: { name: 'test' },
    },
];
</script>

<template>
    <header class="flex p-4 border-b-2 border-slate-200 dark:border-surface-800">
        <div class="flex items-center justify-between w-full xl:w-10/12 mx-auto">
            <div class="flex items-center gap-9">
                <h2 class="text-2xl font-bold leading-tight">
                    <FontAwesomeIcon :icon="faGraduationCap" class="text-primary" />
                    Blokmap
                </h2>
                <div class="flex items-center gap-6">
                    <template v-for="item in navigation" :key="item.name">
                        <RouterLink :to="item.link" class="font-medium" v-slot="{ isExactActive }">
                            <span
                                :class="[
                                    'px-3 py-2 rounded-lg text-md font-medium transition-colors duration-200 ease-out',
                                    isExactActive
                                        ? 'bg-primary-500 text-primary-contrast'
                                        : 'hover:bg-slate-100',
                                ]">
                                {{ item.name }}
                            </span>
                        </RouterLink>
                    </template>
                </div>
            </div>
            <!-- Search and auth -->
            <div class="flex items-center gap-3">
                <template v-if="profileIsLoading || !!profile">
                    <UserAvatar
                        :profile="profile"
                        :logout-is-loading="logoutIsLoading"
                        @logout="$emit('logout')">
                    </UserAvatar>
                </template>

                <template v-else>
                    <RouterLink :to="{ name: 'auth.register' }">
                        <Button>Sign Up</Button>
                    </RouterLink>
                    <RouterLink :to="{ name: 'auth.login' }">
                        <Button severity="contrast">Log In</Button>
                    </RouterLink>
                </template>
                <LocationSearch />
            </div>
        </div>
    </header>
</template>
