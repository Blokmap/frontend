import { onMounted, onUnmounted } from 'vue';

export interface VimControlsOptions {
    enabled?: boolean;
    preventDefault?: boolean;
}

export interface VimKeyBindings {
    /** Move up/previous (k key) */
    onUp?: () => void;
    /** Move down/next (j key) */
    onDown?: () => void;
    /** Move left (arrow left key) */
    onLeft?: () => void;
    /** Move right (arrow right key) */
    onRight?: () => void;
}

export type UseVimControls = {
    enable: () => void;
    disable: () => void;
    isEnabled: () => boolean;
};

/**
 * Composable to add VIM-style keyboard controls to any component.
 * Supports j/k for up/down navigation and arrow keys for left/right.
 *
 * @param bindings - Object containing callback functions for each key
 * @param options - Configuration options for the VIM controls
 * @returns Object with methods to control the VIM functionality
 */
export function useVimControls(
    bindings: VimKeyBindings,
    options: VimControlsOptions = {},
): UseVimControls {
    const { enabled = true, preventDefault = true } = options;

    let isCurrentlyEnabled = enabled;

    const handleKeyDown = (event: KeyboardEvent): void => {
        if (!isCurrentlyEnabled) return;

        const activeElement = document.activeElement;
        const inputTagNames = ['INPUT', 'TEXTAREA', 'SELECT'];
        if (activeElement && inputTagNames.includes(activeElement.tagName)) return;

        switch (event.key) {
            case 'j':
                bindings.onDown?.();
                break;
            case 'k':
                bindings.onUp?.();
                break;
            case 'ArrowLeft':
                bindings.onLeft?.();
                break;
            case 'ArrowRight':
                bindings.onRight?.();
                break;
        }

        if (preventDefault) {
            event.preventDefault();
        }
    };

    const enable = (): void => {
        isCurrentlyEnabled = true;
    };

    const disable = (): void => {
        isCurrentlyEnabled = false;
    };

    const isEnabled = (): boolean => {
        return isCurrentlyEnabled;
    };

    onMounted(() => {
        document.addEventListener('keydown', handleKeyDown);
    });

    onUnmounted(() => {
        document.removeEventListener('keydown', handleKeyDown);
    });

    return {
        enable,
        disable,
        isEnabled,
    };
}
