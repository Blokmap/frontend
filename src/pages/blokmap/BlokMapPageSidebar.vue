<script lang="ts" setup>
import { PrimeIcons } from '@primevue/core';
import { Divider } from 'primevue';
import { useI18n } from 'vue-i18n';
import { GSR_WEBSITE_URL, SOURCE_CODE_URL } from '@/constants';
import Button from 'primevue/button';
import GSRLogo from '@/assets/img/logo/gsr-logo.png';
import BlokmapLogo from '@/assets/img/logo/logo-square-contrast.png';

const { t } = useI18n();
</script>

<template>
    <div id="sidebar" class="shadow-1">
        <img id="logo" :src="BlokmapLogo" />
        <div class="nav-buttons">
            <Button severity="secondary" class="nav-button" rounded>
                <div class="nav-button-content">
                    <i :class="PrimeIcons.BARS"></i>
                    <span class="text-xs">{{ t('pages.blokmap.sidebar.menu') }}</span>
                </div>
            </Button>
            <Button severity="secondary" class="nav-button" rounded>
                <div class="nav-button-content">
                    <i :class="PrimeIcons.BOOKMARK"></i>
                    <span class="text-xs">{{ t('pages.blokmap.sidebar.favorite') }}</span>
                </div>
            </Button>
            <Button severity="secondary" class="nav-button" rounded>
                <div class="nav-button-content">
                    <i :class="PrimeIcons.HISTORY"></i>
                    <span class="text-xs">{{ t('pages.blokmap.sidebar.recent') }}</span>
                </div>
            </Button>
        </div>
        <Divider class="mt-0 mb-3" />
        <div class="social-links">
            <!-- <a
                :href="SOURCE_CODE_URL"
                class="social-link"
                target="_blank"
                v-tooltip="t('pages.blokmap.sidebar.links.source')">
                <i :class="PrimeIcons.GITHUB"></i>
            </a> -->
            <a
                :href="GSR_WEBSITE_URL"
                class="social-link"
                target="_blank"
                v-tooltip="t('pages.blokmap.sidebar.links.gsr')">
                <img :src="GSRLogo" alt="GSR Logo" id="gsr-logo" />
            </a>
        </div>
    </div>
</template>

<style lang="scss" scoped>
#sidebar {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem 0.5rem;
    height: 100%;
    background-color: rgba(white, 1);
    box-shadow: var(--shadow-elevation-4dp);

    #logo {
        height: 3rem;
        width: 3rem;
        margin: 0 auto;
    }

    .nav-buttons {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;

        .nav-button {
            width: 4rem;
            height: 4rem;
            border: none;

            &:not(:hover) {
                background: white;
            }

            .nav-button-content {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0.25rem;
                word-break: break-all;
            }
        }
    }

    .social-links {
        display: inline-flex;
        flex-direction: column;
        gap: 1rem;
        margin-top: auto;
        text-align: center;

        #gsr-logo,
        .pi {
            height: 2.5rem;
            color: var(--surface-800);
            font-size: 2.5rem;
        }
    }
}
</style>
