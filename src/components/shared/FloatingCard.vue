<script setup lang="ts">
interface Props {
    title?: string;
    subtitle?: string;
    elevation?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
    padding?: 'sm' | 'md' | 'lg' | 'xl';
    background?: 'white' | 'surface' | 'transparent';
}

defineSlots<{
    default(): any;
    header(): any;
    footer(): any;
}>();

const props = withDefaults(defineProps<Props>(), {
    elevation: 'md',
    rounded: 'lg',
    padding: 'md',
    background: 'white',
});

const elevationClasses = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl',
};

const roundedClasses = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full',
};

const paddingClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
};

const backgroundClasses = {
    white: 'bg-white dark:bg-surface-800',
    surface: 'bg-surface-0 dark:bg-surface-900',
    transparent: 'bg-transparent',
};
</script>

<template>
    <div
        :class="[
            'border-surface-200 dark:border-surface-700 border transition-colors duration-200',
            elevationClasses[elevation],
            roundedClasses[rounded],
            paddingClasses[padding],
            backgroundClasses[background],
        ]">
        <!-- Header -->
        <header v-if="title || subtitle || $slots.header" class="mb-4">
            <slot name="header">
                <h3 v-if="title" class="text-surface-900 dark:text-surface-0 text-lg font-semibold">
                    {{ title }}
                </h3>
                <p v-if="subtitle" class="text-surface-600 dark:text-surface-400 mt-1 text-sm">
                    {{ subtitle }}
                </p>
            </slot>
        </header>

        <!-- Content -->
        <main class="text-surface-700 dark:text-surface-300">
            <slot />
        </main>

        <!-- Footer -->
        <footer
            v-if="$slots.footer"
            class="border-surface-200 dark:border-surface-700 mt-4 border-t pt-4">
            <slot name="footer" />
        </footer>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
