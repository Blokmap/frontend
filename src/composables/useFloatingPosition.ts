import { nextTick, ref, watch, type Ref } from 'vue';

/**
 * Composable to manage the floating position of an overlay element relative to a trigger element.
 * The overlay will position itself above or below the trigger based on available space in the viewport.
 *
 * @param triggerRef - Ref to the trigger HTMLElement
 * @param overlayRef - Ref to the overlay HTMLElement
 * @param isVisible - Ref indicating whether the overlay is visible
 * @returns An object containing styles for positioning and a method to update the position
 */
export function useFloatingPosition(
    triggerRef: Ref<HTMLElement | null>,
    overlayRef: Ref<HTMLElement | null>,
    isVisible: Ref<boolean>,
) {
    const positionStyles = ref<Record<string, string>>({});

    function updatePosition() {
        if (!triggerRef.value || !overlayRef.value) return;

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
        positionStyles.value = {
            position: 'absolute',
            left: `${left}px`,
            top: `${top}px`,
            zIndex: '9999',
        };
    }

    watch(isVisible, async (visible) => {
        if (visible) {
            await nextTick();
            updatePosition();
        }
    });

    return {
        positionStyles,
        updatePosition,
    };
}
