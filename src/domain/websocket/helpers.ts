import type { WebsocketChannel } from './types';

/**
 * Compares two WebSocket channels for equality.
 *
 * Channels are considered equal if their names and metadata match.
 *
 * @param channelA - The first WebSocket channel to compare
 * @param channelB - The second WebSocket channel to compare
 *
 * @returns True if the channels are equal, false otherwise
 */
export function isWebsocketChannelsEqual(
    channelA: WebsocketChannel,
    channelB: WebsocketChannel,
): boolean {
    if (channelA.name !== channelB.name) {
        return false;
    }

    const metaA = channelA.meta || {};
    const metaB = channelB.meta || {};

    const keysA = Object.keys(metaA);
    const keysB = Object.keys(metaB);

    if (keysA.length !== keysB.length) {
        return false;
    }

    for (const key of keysA) {
        if (metaA[key] !== metaB[key]) {
            return false;
        }
    }

    return true;
}

/**
 * Generates a unique key for a WebSocket channel based on its name and metadata.
 *
 * @param channel - The WebSocket channel
 * @returns A string key representing the channel
 */
export function getWebsocketChannelKey(channel: WebsocketChannel): string {
    const metaStr = channel.meta ? JSON.stringify(channel.meta) : '';
    return `${channel.name}:${metaStr}`;
}
