import { type MaybeRef, computed, onMounted, onUnmounted, toRef } from 'vue';

export interface VimControlsOptions {
    enabled?: MaybeRef<boolean>;
    preventDefault?: MaybeRef<boolean>;
}

export type KeyBinding = string | string[];
export type ActionCallback = () => void;

export interface VimKeyMap {
    [actionName: string]: {
        keys: KeyBinding;
        callback: ActionCallback;
    };
}

/**
 * Composable to add VIM-style keyboard controls with dynamic keybinding system.
 * Supports multiple keys per action and dynamic binding management.
 *
 * @param keyMap - Object mapping action names to key bindings and callbacks
 * @param options - Configuration options for the VIM controls
 * @returns Object with methods to control the VIM functionality
 */
export function useVimControls(keyMap: VimKeyMap = {}, options: VimControlsOptions = {}): void {
    const { enabled = true, preventDefault = true } = options;

    const isCurrentlyEnabled = toRef(enabled);

    const currentKeyMap = { ...keyMap };

    const keyLookup = computed(() => {
        const lookup = new Map<string, string[]>();

        Object.entries(currentKeyMap).forEach(([actionName, binding]) => {
            const keys = Array.isArray(binding.keys) ? binding.keys : [binding.keys];

            keys.forEach((key) => {
                if (!lookup.has(key)) {
                    lookup.set(key, []);
                }
                lookup.get(key)!.push(actionName);
            });
        });

        return lookup;
    });

    const handleKeyDown = (event: KeyboardEvent): void => {
        if (!isCurrentlyEnabled.value) {
            return;
        }

        const activeElement = document.activeElement;
        const inputElements = ['INPUT', 'TEXTAREA', 'SELECT'];
        const isTypingInField = activeElement && inputElements.includes(activeElement.tagName);

        if (isTypingInField) {
            return;
        }

        const actions = keyLookup.value.get(event.key);
        if (!actions || actions.length === 0) return;

        let handled = false;

        actions.forEach((actionName: string) => {
            const binding = currentKeyMap[actionName];
            if (binding?.callback) {
                binding.callback();
                handled = true;
            }
        });

        if (handled && preventDefault) {
            event.preventDefault();
        }
    };

    onMounted(() => {
        document.addEventListener('keydown', handleKeyDown);
    });

    onUnmounted(() => {
        document.removeEventListener('keydown', handleKeyDown);
    });
}
