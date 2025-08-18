<script setup lang="ts">
import { useTheme } from '@/composables/useTheme';
import { faDesktop, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
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
            text
            size="small"
            class="!h-6 !w-6 !bg-slate-100 !p-1 hover:!bg-slate-200 dark:!bg-slate-600 dark:hover:!bg-slate-500"
            v-tooltip.bottom="themeDisplayName">
            <template #icon>
                <FontAwesomeIcon
                    :icon="getThemeIcon(themePreference)"
                    class="text-xs text-slate-700 dark:text-slate-100" />
            </template>
        </Button>

        <!-- Theme Options Popover -->
        <Popover
            ref="popover"
            class="w-48 rounded-lg border border-slate-200 shadow-lg dark:border-slate-700">
            <div class="p-1">
                <h3
                    class="mb-1 px-2 text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
                    Theme
                </h3>
                <div class="space-y-0.5">
                    <button
                        v-for="option in themeOptions"
                        :key="option.value"
                        @click="handleThemeSelect(option.value)"
                        :class="[
                            'flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-left text-sm transition-colors',
                            themePreference === option.value
                                ? 'bg-primary-100 text-primary-700 dark:text-primary-300 dark:bg-slate-700'
                                : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700',
                        ]">
                        <FontAwesomeIcon :icon="getThemeIcon(option.value)" class="h-4 w-4" />
                        <span>{{ option.label }}</span>
                        <span
                            v-if="themePreference === option.value"
                            class="bg-primary-500 dark:bg-primary-400 ml-auto h-2 w-2 rounded-full">
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
