import { nextTick, onMounted, onUnmounted, ref, watch, type Ref } from 'vue';

const FLOATING_OPEN_EVENT = 'floating-position:open';

export function closeFloatingOverlays(except?: symbol) {
    const event = new CustomEvent(FLOATING_OPEN_EVENT, { detail: except });
    document.dispatchEvent?.(event);
}

/**
 * Composable to manage the floating position of an overlay element relative to a trigger element.
 * The overlay will position itself above or below the trigger based on available space in the viewport.
 *
 * @param triggerRef - Ref to the trigger HTMLElement
 * @param overlayRef - Ref to the overlay HTMLElement
 * @param isVisible - Ref indicating whether the overlay is visible
 * @param enforceMaxWidth - Whether to enforce the overlay's max-width to match the trigger's width
 * @returns An object containing styles for positioning and a method to update the position
 */
export function useFloatingPosition(
    triggerRef: Ref<HTMLElement | null>,
    overlayRef: Ref<HTMLElement | null>,
    isVisible: Ref<boolean>,
    enforceMaxWidth: boolean = false,
) {
    const positionStyles = ref<Record<string, string>>({});
    const instanceId = Symbol('floatingPosition');

    function updatePosition() {
        if (!triggerRef.value || !overlayRef.value) {
            return;
        }

        const triggerRect = triggerRef.value.getBoundingClientRect();
        const overlayRect = overlayRef.value.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const scrollX = window.scrollX || window.pageXOffset;
        const scrollY = window.scrollY || window.pageYOffset;

        // Position above if there's more space above and overlay won't fit below
        const spaceBelow = viewportHeight - triggerRect.bottom - 16;
        const spaceAbove = triggerRect.top - 16;
        const positionOnTop = spaceBelow < overlayRect.height && spaceAbove > spaceBelow;

        // Calculate top position with an 8px margin
        const left = triggerRect.left + scrollX;
        const top = positionOnTop
            ? triggerRect.top + scrollY - overlayRect.height - 8
            : triggerRect.bottom + scrollY + 8;

        // Apply calculated styles
        const styles = {
            position: 'absolute',
            left: `${left}px`,
            top: `${top}px`,
            zIndex: '1500',
            maxWidth: '',
        };

        if (enforceMaxWidth) {
            styles.maxWidth = `${triggerRect.width}px`;
        }

        positionStyles.value = styles;
    }

    function onOutsideClick(event: MouseEvent) {
        const triggerEl = triggerRef.value;
        const containerEl = overlayRef.value;

        const containerContains = containerEl?.contains(event.target as Node);
        const triggerContains = triggerEl?.contains(event.target as Node);

        if (!containerContains && !triggerContains) {
            isVisible.value = false;
        }
    }

    function onFloatingOpen(event: Event) {
        const customEvent = event as CustomEvent<symbol>;

        if (customEvent.detail !== instanceId && isVisible.value) {
            isVisible.value = false;
        }
    }

    watch(isVisible, async (visible) => {
        if (visible) {
            closeFloatingOverlays(instanceId);
            await nextTick();
            updatePosition();
        }
    });

    onMounted(() => {
        document.addEventListener(FLOATING_OPEN_EVENT, onFloatingOpen);
        document.addEventListener('click', onOutsideClick);
    });

    onUnmounted(() => {
        document.removeEventListener(FLOATING_OPEN_EVENT, onFloatingOpen);
        document.removeEventListener('click', onOutsideClick);
    });

    return {
        positionStyles,
        updatePosition,
    };
}
