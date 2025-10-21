import { ref, watch, onUnmounted, unref, type MaybeRef } from 'vue';
import { websocketEndpoint } from '@/config/endpoints';

export interface WebsocketChannel {
    profileId?: number;
    tag?: string;
}

/**
 * Composable to manage WebSocket connections for a given channel.
 *
 * Opens a WebSocket connection to the specified channel and automatically
 * manages connection lifecycle. When the channel changes, the previous
 * WebSocket is closed and a new one is opened.
 *
 * @param channel - The channel to connect to (reactive or static), can be null
 * @param onMessage - Optional callback for handling incoming messages
 * @returns WebSocket connection state and send function
 */
export function useWebsocket<T = any>(
    channel: MaybeRef<WebsocketChannel | null>,
    onMessage?: (data: T) => void,
) {
    const ws = ref<WebSocket | null>(null);
    const isConnected = ref<boolean>(false);

    /**
     * Opens a new WebSocket connection for the given channel
     *
     * @param channelData - The channel data to subscribe to
     */
    function connect(channelData: WebsocketChannel): void {
        // Close existing connection if any
        if (ws.value) {
            disconnect();
        }

        // Construct WebSocket URL
        const host = window.location.host;
        const wsUrl = `wss://${host}${websocketEndpoint}`;

        // Create new WebSocket connection
        ws.value = new WebSocket(wsUrl);

        ws.value.onopen = () => {
            isConnected.value = true;

            // Send channel subscription message
            if (ws.value && ws.value.readyState === WebSocket.OPEN) {
                const message = JSON.stringify(channelData);
                ws.value.send(message);
            }
        };

        ws.value.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (onMessage) {
                    onMessage(data);
                }
            } catch (error) {
                console.error('[WebSocket] Failed to parse message:', error);
            }
        };

        ws.value.onerror = (error) => {
            console.error('[WebSocket] Error:', error);
        };

        ws.value.onclose = () => {
            isConnected.value = false;
        };
    }

    /**
     * Closes the WebSocket connection
     */
    function disconnect(): void {
        if (ws.value) {
            ws.value.close();
            ws.value = null;
            isConnected.value = false;
        }
    }

    /**
     * Send a message through the WebSocket
     *
     * @param data - The data to send (will be JSON stringified)
     * @returns true if message was sent, false otherwise
     */
    function send(data: any): boolean {
        if (ws.value && ws.value.readyState === WebSocket.OPEN) {
            ws.value.send(JSON.stringify(data));
            return true;
        }
        return false;
    }

    // Watch for channel changes and reconnect
    watch(
        () => unref(channel),
        (newChannel) => {
            if (newChannel) {
                connect(newChannel);
            } else {
                disconnect();
            }
        },
        { immediate: true, deep: true },
    );

    // Clean up on unmount
    onUnmounted(disconnect);

    return {
        ws,
        isConnected,
        send,
        disconnect,
    };
}
