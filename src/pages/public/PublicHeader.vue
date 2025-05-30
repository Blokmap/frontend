<script lang="ts" setup>
import UserAvatar from '@/components/features/profile/UserAvatar.vue';
import Logo from '@/components/shared/Logo.vue';
import type { MenubarDesignTokens } from '@primeuix/themes/types/menubar';
import { PrimeIcons } from '@primevue/core';
import { Menubar } from 'primevue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterLink, useRouter } from 'vue-router';

/* Composables */
const { t } = useI18n();
const router = useRouter();

/* State */

// The menu items presented in the menubar
const menuItems = ref([
    {
        label: t('Open de Blokmap'),
        icon: PrimeIcons.MAP_MARKER,
        command: () => router.push({ name: 'home' }),
    },
    {
        label: 'Bloklocaties',
        icon: PrimeIcons.BUILDING,
        badge: 3,
        items: [
            {
                label: 'Lijst',
                icon: PrimeIcons.LIST,
            },
            {
                label: 'Toevoegen',
                icon: PrimeIcons.PLUS,
            },
            {
                separator: true,
            },
            {
                label: 'Melden',
                icon: PrimeIcons.EXCLAMATION_TRIANGLE,
            },
        ],
    },
]);

// Scoped design tokens for the menubar
const menuDt = ref<MenubarDesignTokens>({
    root: { background: 'transparent' },
    item: {
        color: 'var(--surface-800)',
        focusBackground: 'var(--background-400)',
        activeBackground: 'var(--background-400)',
        icon: {
            color: 'var(--background-800)',
            focusColor: 'var(--background-800)',
            activeColor: 'var(--background-800)',
        },
    },
    submenu: {
        icon: {
            color: 'var(--background-800)',
            focusColor: 'var(--background-800)',
            activeColor: 'var(--background-800)',
        },
    },
    mobileButton: {
        hoverBackground: 'none',
    },
});
</script>

<template>
    <Menubar :model="menuItems" :dt="menuDt" breakpoint="720px">
        <template #start>
            <RouterLink :to="{ name: 'home' }">
                <div class="mr-3">
                    <Logo />
                </div>
            </RouterLink>
        </template>
        <template #end>
            <UserAvatar
                :style="{
                    background: 'var(--primary-500)',
                    color: 'var(--primary-100)',
                }">
            </UserAvatar>
        </template>
    </Menubar>
</template>
