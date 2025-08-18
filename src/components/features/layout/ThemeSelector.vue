<script setup lang="ts">
import { useTheme } from '@/composables/useTheme';
import { faMoon, faSun, faDesktop } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Button from 'primevue/button';
import Popover from 'primevue/popover';
import { useTemplateRef } from 'vue';

const { themePreference, themeDisplayName, setTheme, getThemeOptions } = useTheme();

const popoverRef = useTemplateRef('popover');

function handleThemeButtonClick(event: MouseEvent): void {
    popoverRef.value?.toggle(event);
}

function handleThemeSelect(theme: 'light' | 'dark' | 'system'): void {
    setTheme(theme);
    popoverRef.value?.hide();
}

function getThemeIcon(theme: 'light' | 'dark' | 'system') {
    switch (theme) {
        case 'light':
            return faSun;
        case 'dark':
            return faMoon;
        case 'system':
            return faDesktop;
        default:
            return faDesktop;
    }
}

const themeOptions = getThemeOptions();
</script>

<template>
    <div class="relative">
        <!-- Theme Toggle Button -->
        <Button
            severity="contrast"
            @click="handleThemeButtonClick"
            rounded
            text
            class="!p-2 !bg-slate-100 dark:!bg-slate-600 hover:!bg-slate-200 dark:hover:!bg-slate-500"
            v-tooltip.bottom="themeDisplayName">
            <template #icon>
                <FontAwesomeIcon :icon="getThemeIcon(themePreference)" class="text-sm text-slate-700 dark:text-slate-100" />
            </template>
        </Button>

        <!-- Theme Options Popover -->
        <Popover
            ref="popover"
            class="w-48 rounded-lg border border-slate-200 dark:border-slate-700 shadow-lg">
            <div class="p-2">
                <h3 class="mb-2 px-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Theme
                </h3>
                <div class="space-y-1">
                    <button
                        v-for="option in themeOptions"
                        :key="option.value"
                        @click="handleThemeSelect(option.value)"
                        :class="[
                            'flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors',
                            themePreference === option.value
                                ? 'bg-primary-100 dark:bg-slate-700 text-primary-700 dark:text-primary-300'
                                : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                        ]">
                        <FontAwesomeIcon :icon="getThemeIcon(option.value)" class="h-4 w-4" />
                        <span>{{ option.label }}</span>
                        <span 
                            v-if="themePreference === option.value"
                            class="ml-auto h-2 w-2 rounded-full bg-primary-500 dark:bg-primary-400">
                        </span>
                    </button>
                </div>
            </div>
        </Popover>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
