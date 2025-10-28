import { ref, onUnmounted, type MaybeRef, toValue, watch } from 'vue';
import { websocketEndpoint } from '@/config/endpoints';
import {
    getWebsocketChannelKey,
    isWebsocketChannelsEqual,
    WebsocketCommandEvent,
    WebsocketMessageEvent,
    type WebsocketChannel,
    type WebsocketMessage,
} from '@/domain/websocket';

// See BlokMap Websocket Protocol documentation
// [url]

export type WebsocketMessageHandler<T = unknown> = (message: WebsocketMessage<T>) => void;

export type WebsocketSubscription<T = unknown> = {
    channel: WebsocketChannel;
    onMessage: WebsocketMessageHandler<T>;
};

/**
 * Composable to manage WebSocket connections with dynamic channel subscriptions.
 *
 * Opens a WebSocket connection and manages channel subscriptions dynamically.
 * Supports subscribing and unsubscribing from channels on the same connection.
 *
 * @param enabled - Whether the WebSocket connection should be active (reactive or static)
 * @returns WebSocket connection state and control functions
 */
export function useWebsocket(enabled: MaybeRef<boolean> = true) {
    const ws = ref<WebSocket | null>(null);
    const isConnected = ref<boolean>(false);
    const subscriptions = ref<Map<string, WebsocketSubscription>>(new Map());

    /**
     * Opens a new WebSocket connection
     */
    function connect(): void {
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

            if (!ws.value || ws.value.readyState !== WebSocket.OPEN) {
                return;
            }

            // Re-subscribe to all existing channels on reconnection
            for (const subscription of subscriptions.value.values()) {
                const command = JSON.stringify({
                    channel: subscription.channel,
                    event: WebsocketCommandEvent.SUBSCRIBE,
                });

                ws.value.send(command);
            }

            console.log('[WebSocket] Connected');
        };

        ws.value.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data) as WebsocketMessage<unknown>;

                if (message.event === WebsocketMessageEvent.SubscribeSuccess) {
                    return console.log('[WebSocket] Server acknowledged subscription');
                }

                // Find matching subscription and call its handler
                for (const subscription of subscriptions.value.values()) {
                    if (isWebsocketChannelsEqual(message.channel, subscription.channel)) {
                        subscription.onMessage(message);
                    }
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
            console.log('[WebSocket] Disconnected');
        };
    }

    /**
     * Closes the WebSocket connection and clears all subscriptions
     */
    function disconnect(): void {
        if (ws.value) {
            ws.value.close();
            ws.value = null;
            isConnected.value = false;
        }
    }

    /**
     * Subscribe to a channel
     *
     * @param channel - The channel to subscribe to
     * @param onMessage - Callback to handle messages from this channel
     * @returns Unsubscribe function
     */
    function subscribe<T = unknown>(
        channel: WebsocketChannel,
        onMessage: WebsocketMessageHandler<T>,
    ): () => void {
        const key = getWebsocketChannelKey(channel);

        // Don't subscribe twice to the same channel
        if (subscriptions.value.has(key)) {
            console.warn(`[WebSocket] Already subscribed to channel ${channel.name}`);
            return () => unsubscribe(channel);
        }

        const subscription: WebsocketSubscription<any> = {
            channel,
            onMessage,
        };

        subscriptions.value.set(key, subscription);

        // Send subscription command if connected
        if (ws.value && ws.value.readyState === WebSocket.OPEN) {
            const command = JSON.stringify({
                channel,
                event: WebsocketCommandEvent.SUBSCRIBE,
            });

            ws.value.send(command);

            console.log(`[WebSocket] Subscribed to channel ${channel.name}`);
        }

        // Return unsubscribe function
        return () => unsubscribe(channel);
    }

    /**
     * Unsubscribe from a channel
     *
     * @param channel - The channel to unsubscribe from
     */
    function unsubscribe(channel: WebsocketChannel): void {
        const key = getWebsocketChannelKey(channel);

        if (!subscriptions.value.has(key)) {
            console.warn(`[WebSocket] Not subscribed to channel ${channel.name}`);
            return;
        }

        subscriptions.value.delete(key);

        // Send unsubscription command if connected
        if (ws.value && ws.value.readyState === WebSocket.OPEN) {
            const command = JSON.stringify({
                channel,
                event: WebsocketCommandEvent.UNSUBSCRIBE,
            });

            ws.value.send(command);

            console.log(`[WebSocket] Unsubscribed from channel ${channel.name}`);
        }
    }

    /**
     * Send a custom command through the WebSocket
     *
     * @param data - The data to send (will be JSON stringified)
     * @returns true if message was sent, false otherwise
     */
    function send<T = unknown>(data: T): boolean {
        if (ws.value && ws.value.readyState === WebSocket.OPEN) {
            ws.value.send(JSON.stringify(data));
            return true;
        }
        return false;
    }

    watch(
        () => toValue(enabled),
        (newVal) => {
            if (newVal) {
                connect();
            } else {
                disconnect();
            }
        },
        { immediate: true },
    );

    // Cleanup on unmount
    onUnmounted(() => {
        disconnect();
    });

    return {
        ws,
        isConnected,
        subscribe,
        unsubscribe,
        send,
        disconnect,
    };
}
