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
    return getWebsocketChannelKey(channelA) === getWebsocketChannelKey(channelB);
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
