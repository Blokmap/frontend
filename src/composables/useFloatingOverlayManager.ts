const openOverlays = new Set<() => void>();

export function useFloatingOverlayManager() {
    function register(closeCallback: () => void) {
        openOverlays.add(closeCallback);
    }

    function unregister(closeCallback: () => void) {
        openOverlays.delete(closeCallback);
    }

    function closeAll(except?: () => void) {
        openOverlays.forEach((close) => close !== except && close());
    }

    return { register, unregister, closeAll };
}

export function closeFloatingOverlays() {
    openOverlays.forEach((close) => close());
}
