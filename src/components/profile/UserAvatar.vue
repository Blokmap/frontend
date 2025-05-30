<script lang="ts" setup>
import { useAuthStore } from '@/composables/stores/useAuthStore';
import { useMessages } from '@/composables/useMessages';
import type { AvatarDesignTokens } from '@primeuix/themes/types/avatar';
import { PrimeIcons } from '@primevue/core';
import Avatar, { type AvatarProps } from 'primevue/avatar';
import Menu from 'primevue/menu';
import Skeleton from 'primevue/skeleton';
import { computed, ref, useAttrs, useTemplateRef } from 'vue';
import { useRouter } from 'vue-router';

/* Composables */
const { user, logout } = useAuthStore();
const { showInfo } = useMessages();
const router = useRouter();
const attrs = useAttrs();

/* Props */
const props = defineProps<AvatarProps>();

/* Template refs */
const menu = useTemplateRef('menu');

/* Computed */
const initials = computed(() => {
    if (!user.data) return null;
    const { firstName, lastName } = user.data;
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
});

const items = computed(() => {
    if (!user.data) {
        // User is not logged in
        return [
            {
                label: 'Login',
                icon: PrimeIcons.SIGN_IN,
                command: () => {
                    // Navigate to login page
                },
            },
            {
                label: 'Register',
                icon: PrimeIcons.USER_PLUS,
                command: () => {
                    router.push({
                        name: 'auth.register',
                    });
                },
            },
        ];
    } else {
        // User is logged in
        return [
            {
                label: 'Profile',
                icon: PrimeIcons.USER,
                command: () => {
                    // Navigate to profile page
                },
            },
            {
                label: 'Settings',
                icon: PrimeIcons.COG,
                command: () => {
                    // Navigate to settings page
                },
            },
            {
                label: 'Logout',
                icon: PrimeIcons.SIGN_OUT,
                command: async () => {
                    await logout.mutateAsync();
                    showInfo('Logged out successfully');
                },
            },
        ];
    }
});

const avatarDt: AvatarDesignTokens = {
    root: {
        width: '3rem',
        height: '3rem',
    },
};

/**
 * Toggles the visibility of a menu when triggered by an event.
 *
 * @param {Event} event - The event object that triggers the menu toggle.
 */
const toggleMenu = (event: Event) => {
    menu.value?.toggle(event);
};
</script>

<template>
    <!-- Loading state -->
    <template v-if="user.isLoading">
        <Skeleton shape="circle" width="3rem" height="3rem" />
    </template>

    <!-- Loaded state -->
    <template v-else>
        <Avatar
            class="cursor-pointer"
            v-bind="{ ...attrs, ...props }"
            shape="circle"
            :dt="avatarDt"
            @click="toggleMenu">
            <template v-if="user.data">
                <span class="text-primary">{{ initials }}</span>
            </template>
            <template v-else>
                <i :class="PrimeIcons.USER" />
            </template>
        </Avatar>

        <Menu ref="menu" :model="items" popup />
    </template>
</template>
