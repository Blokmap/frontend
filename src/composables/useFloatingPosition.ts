import { nextTick, onMounted, onUnmounted, ref, watch, watchEffect, type Ref } from 'vue';

const FLOATING_OPEN_EVENT = 'floating-position:open';

// Position constants
const VERTICAL_GAP = 16;
const HORIZONTAL_MARGIN = 12;
const VERTICAL_MARGIN = 8;
const Z_INDEX = '1500';
const TRANSITION_DURATION = 200;

export function closeFloatingOverlays(except?: symbol) {
    const event = new CustomEvent(FLOATING_OPEN_EVENT, { detail: except });
    document.dispatchEvent?.(event);
}

/**
 * Composable to manage the floating position of an overlay element relative to a trigger element.
 */
export function useFloatingPosition(
    triggerRef: Ref<HTMLElement | null>,
    overlayRef: Ref<HTMLElement | null>,
    isVisible: Ref<boolean>,
    enforceMaxWidth: boolean = false,
) {
    const positionStyles = ref<Record<string, string>>({});
    const instanceId = Symbol('floatingPosition');

    function alignOverlay(animate = false) {
        if (!triggerRef.value || !overlayRef.value) {
            return;
        }

        const trigger = triggerRef.value;
        const overlay = overlayRef.value;

        // Enable/disable transition animation
        if (animate) {
            overlay.style.transition = `left ${TRANSITION_DURATION}ms ease-out, top ${TRANSITION_DURATION}ms ease-out`;
        } else {
            overlay.style.transition = '';
        }

        overlay.style.left = '';
        overlay.style.top = '';
        overlay.style.transformOrigin = 'center top';

        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight,
        };

        const triggerRect = trigger.getBoundingClientRect();
        const overlayRect = overlay.getBoundingClientRect();
        const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;

        let top = 0;
        let left = 0;

        // Determine vertical position
        const spaceBelow = viewport.height - triggerRect.bottom;
        const spaceAbove = triggerRect.top;

        if (spaceBelow >= overlayRect.height || spaceBelow > spaceAbove) {
            // Position below trigger
            top = triggerRect.bottom + scrollY + VERTICAL_GAP;
            overlay.style.transformOrigin = 'center top';
        } else {
            // Position above trigger - align top of overlay with top of trigger minus gap
            top = triggerRect.top + scrollY - overlayRect.height - VERTICAL_GAP;
            overlay.style.transformOrigin = 'center bottom';
        }

        // Horizontal positioning: center relative to trigger
        const triggerCenterX = triggerRect.left + triggerRect.width / 2;
        left = triggerCenterX + scrollX - overlayRect.width / 2;

        // Check if horizontal centering would overflow viewport
        const wouldOverflowRight =
            left + overlayRect.width > viewport.width + scrollX - HORIZONTAL_MARGIN;

        const wouldOverflowLeft = left < scrollX + HORIZONTAL_MARGIN;

        // If it would overflow, center it horizontally in the viewport instead
        if (wouldOverflowRight || wouldOverflowLeft) {
            left = scrollX + (viewport.width - overlayRect.width) / 2;
        }

        // Final constraint: ensure it stays within viewport bounds
        if (left < scrollX + HORIZONTAL_MARGIN) {
            left = scrollX + HORIZONTAL_MARGIN;
        }

        if (left + overlayRect.width > viewport.width + scrollX - HORIZONTAL_MARGIN) {
            left = viewport.width + scrollX - overlayRect.width - HORIZONTAL_MARGIN;
        }

        // Constrain to viewport vertically
        if (top + overlayRect.height > viewport.height + scrollY) {
            top = Math.max(
                VERTICAL_MARGIN,
                viewport.height + scrollY - overlayRect.height - VERTICAL_MARGIN,
            );
        }

        if (top < scrollY + VERTICAL_MARGIN) {
            top = scrollY + VERTICAL_MARGIN;
        }

        const styles: Record<string, string> = {
            position: 'absolute',
            left: `${Math.round(left)}px`,
            top: `${Math.round(top)}px`,
            zIndex: Z_INDEX,
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

    // Watch for visibility changes and recalculate position
    watchEffect(() => {
        if (isVisible.value && triggerRef.value && overlayRef.value) {
            alignOverlay();
        }
    });

    // Watch for trigger ref changes and recalculate position
    watch(
        triggerRef,
        async () => {
            if (isVisible.value && triggerRef.value && overlayRef.value) {
                await nextTick();
                // Enable animation when switching between triggers
                alignOverlay(true);
            }
        },
        { flush: 'post' },
    );

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
        updatePosition: alignOverlay,
    };
}
