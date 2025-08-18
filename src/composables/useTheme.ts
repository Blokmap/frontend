import { useLocalStorage } from '@vueuse/core';
import { computed, onMounted, watch } from 'vue';

type Theme = 'light' | 'dark' | 'system';

/**
 * Composable for managing the application theme (light/dark mode).
 * 
 * Features:
 * - Persistent theme preference using localStorage
 * - System theme detection and automatic switching
 * - Manual theme override
 * - Reactive theme state
 */
export function useTheme() {
    // Persistent theme preference with default to 'system'
    const themePreference = useLocalStorage<Theme>('theme', 'system');

    // Computed value for the current system theme
    const systemTheme = computed(() => {
        if (typeof window === 'undefined') return 'light';
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });

    // Computed value for the actual theme being used
    const currentTheme = computed(() => {
        if (themePreference.value === 'system') {
            return systemTheme.value;
        }
        return themePreference.value;
    });

    // Computed value to check if dark mode is active
    const isDark = computed(() => currentTheme.value === 'dark');

    /**
     * Apply the theme to the DOM
     */
    function applyTheme(theme: 'light' | 'dark') {
        const root = document.documentElement;
        const body = document.body;

        if (theme === 'dark') {
            root.classList.add('dark');
            body.classList.add('dark');
        } else {
            root.classList.remove('dark');
            body.classList.remove('dark');
        }
    }

    /**
     * Set the theme preference
     */
    function setTheme(theme: Theme) {
        themePreference.value = theme;
    }

    /**
     * Toggle between light and dark theme
     */
    function toggleTheme() {
        if (themePreference.value === 'system') {
            // If currently using system, switch to opposite of current system theme
            setTheme(systemTheme.value === 'dark' ? 'light' : 'dark');
        } else {
            // Toggle between light and dark
            setTheme(themePreference.value === 'dark' ? 'light' : 'dark');
        }
    }

    /**
     * Get all available theme options
     */
    function getThemeOptions() {
        return [
            { label: 'Light', value: 'light' as Theme },
            { label: 'Dark', value: 'dark' as Theme },
            { label: 'System', value: 'system' as Theme },
        ];
    }

    /**
     * Get display name for current theme
     */
    const themeDisplayName = computed(() => {
        switch (themePreference.value) {
            case 'light':
                return 'Light';
            case 'dark':
                return 'Dark';
            case 'system':
                return `System (${systemTheme.value})`;
            default:
                return 'System';
        }
    });

    // Watch for changes in theme preference or system theme
    watch(
        [themePreference, systemTheme],
        () => {
            applyTheme(currentTheme.value);
        },
        { immediate: true }
    );

    // Listen for system theme changes
    onMounted(() => {
        if (typeof window !== 'undefined') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = () => {
                // Force reactivity update for systemTheme
                if (themePreference.value === 'system') {
                    applyTheme(currentTheme.value);
                }
            };

            mediaQuery.addEventListener('change', handleChange);

            // Cleanup listener on unmount
            return () => {
                mediaQuery.removeEventListener('change', handleChange);
            };
        }
    });

    return {
        themePreference,
        currentTheme,
        isDark,
        systemTheme,
        themeDisplayName,
        setTheme,
        toggleTheme,
        getThemeOptions,
    };
}
