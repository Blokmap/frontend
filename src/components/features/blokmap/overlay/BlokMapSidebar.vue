<script lang="ts" setup>
import { PrimeIcons } from '@primevue/core';
import { Divider, Drawer, Button, Avatar } from 'primevue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const emit = defineEmits(['update:position']);

const showMainMenu = defineModel<boolean>('showMenu', {
    default: false,
});

const showRecentMenu = defineModel<boolean>('showRecentMenu', {
    default: false,
});

const showFavoritesMenu = defineModel<boolean>('showFavoritesMenu', {
    default: false,
});
</script>

<template>
    <div class="pointer-events-auto h-full">
        <!-- Collapsed sidebar -->
        <div class="sidebar hidden sm:flex shadow-1 menu">
            <div class="content">
                <slot />
                <Button
                    severity="secondary"
                    v-tooltip="t('components.sidebar.items.favorite')"
                    @click="showFavoritesMenu = !showFavoritesMenu"
                    rounded>
                    <i :class="PrimeIcons.BOOKMARK" class="text-xl"></i>
                </Button>
                <Button
                    severity="secondary"
                    v-tooltip="t('components.sidebar.items.recent')"
                    @click="showRecentMenu = !showRecentMenu"
                    rounded>
                    <i :class="PrimeIcons.HISTORY" class="text-xl"></i>
                </Button>
            </div>
            <div class="footer">
                <Avatar class="mx-auto" label="EV" shape="circle"></Avatar>
            </div>
        </div>
        <!-- Main menu -->
        <Drawer class="menu" v-model:visible="showMainMenu">
            <template #header>
                <img class="logo" alt="Blokmap Logo" src="@/assets/img/logo/logo-contrast.png" />
            </template>
            <template #default>
                <Divider class="mt-0" />
                <div class="flex flex-column gap-2">
                    <Button
                        severity="secondary"
                        class="nav-button"
                        @click="showFavoritesMenu = !showFavoritesMenu"
                        rounded>
                        <div class="nav-button-content">
                            <i :class="PrimeIcons.BOOKMARK"></i>
                            {{ t('components.sidebar.items.favorite') }}
                        </div>
                    </Button>
                    <Button
                        severity="secondary"
                        class="nav-button"
                        @click="showRecentMenu = !showRecentMenu"
                        rounded>
                        <div class="nav-button-content">
                            <i :class="PrimeIcons.HISTORY"></i>
                            {{ t('components.sidebar.items.recent') }}
                        </div>
                    </Button>
                </div>
            </template>
            <template #footer>
                <Divider class="mb-0" />
            </template>
        </Drawer>
        <!-- Favorites menu -->
        <Drawer class="menu" v-model:visible="showFavoritesMenu">
            <template #header>
                <img class="logo" alt="Blokmap Logo" src="@/assets/img/logo/logo-contrast.png" />
            </template>
            <template #default> Hellaur </template>
            <template #footer>
                <Divider class="mt-0" />
            </template>
        </Drawer>
    </div>
</template>

<style lang="scss">
.logo {
    height: 3rem;
}

.sidebar {
    display: flex;
    flex-direction: column;
    padding: 1rem 0.75rem;
    height: 100%;
    background-color: rgba(white, 1);
    box-shadow: var(--shadow-elevation-4dp);

    > .logo {
        height: 3rem;
        width: 3rem;
        margin: 0 auto;
    }

    .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;

        > button {
            width: 3rem;
            height: 3rem;
            justify-content: center;
        }
    }

    .footer {
        display: inline-flex;
        flex-direction: column;
        gap: 1rem;
        text-align: center;
        margin-top: auto;

        #gsr-logo {
            height: 2.5rem;
            color: var(--surface-800);
            font-size: 2.5rem;
        }
    }
}
</style>
