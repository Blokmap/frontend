<script setup lang="ts">
import ThemeSelector from '@/components/features/layout/ThemeSelector.vue';
import FloatingCard from '@/components/shared/FloatingCard.vue';
import { useTheme } from '@/composables/useTheme';

const { isDark, themeDisplayName } = useTheme();
</script>

<template>
    <div class="bg-surface-50 dark:bg-surface-900 min-h-screen p-6 transition-colors duration-300">
        <div class="mx-auto max-w-4xl space-y-6">
            <!-- Header -->
            <div class="text-center">
                <h1 class="text-surface-900 dark:text-surface-0 mb-2 text-3xl font-bold">
                    Dark Mode Demo
                </h1>
                <p class="text-surface-600 dark:text-surface-400">
                    Current theme: {{ themeDisplayName }} {{ isDark ? '🌙' : '☀️' }}
                </p>
            </div>

            <!-- Theme Selector -->
            <div class="flex justify-center">
                <ThemeSelector />
            </div>

            <!-- Sample Cards -->
            <div class="grid gap-6 md:grid-cols-2">
                <FloatingCard
                    title="Default Card"
                    subtitle="This is a default floating card with shadow"
                    elevation="md">
                    <p class="text-sm">
                        This card demonstrates the default styling with automatic dark mode support.
                        The background, borders, and text colors all adapt based on the current
                        theme.
                    </p>
                    <template #footer>
                        <div class="flex justify-end">
                            <button
                                class="bg-primary-500 hover:bg-primary-600 rounded-md px-4 py-2 text-white transition-colors">
                                Action Button
                            </button>
                        </div>
                    </template>
                </FloatingCard>

                <FloatingCard
                    title="Surface Card"
                    subtitle="This card uses surface background"
                    background="surface"
                    elevation="lg">
                    <p class="text-sm">
                        This card uses the surface background variant, which provides a slightly
                        different appearance while maintaining accessibility in both light and dark
                        modes.
                    </p>
                </FloatingCard>

                <FloatingCard
                    title="Large Card"
                    subtitle="Extra large padding and shadow"
                    padding="xl"
                    elevation="xl"
                    rounded="xl">
                    <div class="space-y-4">
                        <p class="text-sm">
                            This card showcases larger padding and shadow options.
                        </p>
                        <div class="grid grid-cols-2 gap-4 text-xs">
                            <div class="bg-surface-100 dark:bg-surface-800 rounded p-3">
                                <div class="font-semibold">Feature 1</div>
                                <div class="text-surface-600 dark:text-surface-400">
                                    Description
                                </div>
                            </div>
                            <div class="bg-surface-100 dark:bg-surface-800 rounded p-3">
                                <div class="font-semibold">Feature 2</div>
                                <div class="text-surface-600 dark:text-surface-400">
                                    Description
                                </div>
                            </div>
                        </div>
                    </div>
                </FloatingCard>

                <FloatingCard title="Transparent Card" background="transparent" elevation="sm">
                    <p class="text-sm">
                        This card has a transparent background, useful for overlays or special
                        contexts. The border still provides definition while maintaining the
                        background visibility.
                    </p>
                </FloatingCard>
            </div>

            <!-- Color Palette Demo -->
            <FloatingCard
                title="Color Palette"
                subtitle="Primary and surface colors in both themes">
                <div class="grid grid-cols-2 gap-6">
                    <div>
                        <h4 class="text-surface-900 dark:text-surface-0 mb-3 font-semibold">
                            Primary Colors
                        </h4>
                        <div class="space-y-2">
                            <div class="flex items-center gap-3">
                                <div class="bg-primary-500 h-6 w-6 rounded"></div>
                                <span class="text-sm">Primary 500</span>
                            </div>
                            <div class="flex items-center gap-3">
                                <div class="bg-primary-600 h-6 w-6 rounded"></div>
                                <span class="text-sm">Primary 600</span>
                            </div>
                            <div class="flex items-center gap-3">
                                <div class="bg-secondary-500 h-6 w-6 rounded"></div>
                                <span class="text-sm">Secondary 500</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 class="text-surface-900 dark:text-surface-0 mb-3 font-semibold">
                            Surface Colors
                        </h4>
                        <div class="space-y-2">
                            <div class="flex items-center gap-3">
                                <div
                                    class="bg-surface-100 dark:bg-surface-800 border-surface-200 dark:border-surface-700 h-6 w-6 rounded border"></div>
                                <span class="text-sm">Surface 100/800</span>
                            </div>
                            <div class="flex items-center gap-3">
                                <div
                                    class="bg-surface-200 dark:bg-surface-700 h-6 w-6 rounded"></div>
                                <span class="text-sm">Surface 200/700</span>
                            </div>
                            <div class="flex items-center gap-3">
                                <div
                                    class="bg-surface-300 dark:bg-surface-600 h-6 w-6 rounded"></div>
                                <span class="text-sm">Surface 300/600</span>
                            </div>
                        </div>
                    </div>
                </div>
            </FloatingCard>
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
