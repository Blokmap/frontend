import { timeToMinutes, minutesToTime } from './timeConvertUtils';
import type { Time, TimeGranularity } from './timeTypes';

export * from './timeTypes';
export * from './timeConvertUtils';
export * from './timeFormatUtils';
export * from './timeOverlapUtils';

/**
 * Rounds a number to the nearest interval.
 *
 * @param value - The value to round.
 * @param interval - The interval to round to.
 * @returns The rounded value.
 */
export function roundToInterval(value: number, interval: number): number {
    return Math.round(value / interval) * interval;
}

/**
 * Creates a Time object with the given hours and minutes.
 *
 * @param hours - The hours value.
 * @param minutes - The minutes value.
 * @returns A Time object.
 */
export function createTime(hours: number, minutes: number): Time {
    return { hours, minutes };
}

/**
 * Add time to a Time object with specified granularity.
 *
 * @param time - The Time object to add to.
 * @param amount - The amount to add.
 * @param granularity - The granularity: 'hours' or 'minutes'.
 * @returns A new Time object with the added time.
 */
export function addToTime(time: Time, amount: number, granularity: TimeGranularity): Time {
    const minutes = granularity === 'hours' ? amount * 60 : amount;
    const totalMinutes = timeToMinutes(time) + minutes;
    return minutesToTime(Math.max(0, Math.min(1439, totalMinutes))); // Clamp to valid day range
}

/**
 * Get the duration between two Time objects in minutes.
 *
 * @param startTime - The start time.
 * @param endTime - The end time.
 * @returns Duration in minutes.
 */
export function getTimeDuration(startTime: Time, endTime: Time): number {
    return timeToMinutes(endTime) - timeToMinutes(startTime);
}

/**
 * Checks if a given time is considered "evening" (between 6 PM and 10 PM).
 *
 * @param time - The Time object to check.
 * @returns True if the time is in the evening, false otherwise.
 */
export function isEvening(time: Time): boolean {
    return time.hours >= 18 && time.hours < 22;
}

/**
 * Checks if a given time is considered "night" (before 6 AM or after 8 PM).
 *
 * @param time - The Time object to check.
 * @returns True if the time is at night, false otherwise.
 */
export function isNight(time: Time): boolean {
    return time.hours < 6 || time.hours >= 22;
}

/**
 * Checks if a given time is considered "morning" (between 6 AM and 12 PM).
 *
 * @param time - The Time object to check.
 * @returns True if the time is in the morning, false otherwise.
 */
export function isMorning(time: Time): boolean {
    return time.hours >= 6 && time.hours < 12;
}
