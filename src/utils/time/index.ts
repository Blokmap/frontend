import type { Time, TimeGranularity } from './types';

/**
 * Converts a Time object to a string in HH:MM format.
 *
 * @param time - The Time object to convert.
 * @returns A string in HH:MM format.
 */
export function timeToString(
    time?: Time | null,
    compact: boolean = false,
): string | undefined | null {
    if (!time) return time;
    if (compact) {
        if (time.minutes === 0) {
            return `${time.hours}u`;
        }
        return `${time.hours}u${time.minutes.toString().padStart(2, '0')}`;
    }
    return `${time.hours.toString().padStart(2, '0')}:${time.minutes.toString().padStart(2, '0')}`;
}

/**
 * Converts a string in HH:MM format to a Time object.
 *
 * @param timeString - The time string in HH:MM format.
 * @returns A Time object.
 */
export function stringToTime(timeString?: string | null): Time | null | undefined {
    if (timeString === undefined) return undefined;
    if (timeString === null) return null;
    const [hours, minutes] = timeString.split(':').map(Number);
    return { hours, minutes };
}

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
 * Converts a Time object to total minutes since start of day.
 *
 * @param time - The Time object to convert.
 * @returns Total minutes.
 */
export function timeToMinutes(time: Time): number {
    return time.hours * 60 + time.minutes;
}

/**
 * Converts total minutes to a Time object.
 *
 * @param totalMinutes - The total minutes since start of day.
 * @returns A Time object.
 */
export function minutesToTime(totalMinutes: number): Time {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return { hours, minutes };
}

/**
 * Converts a Date object to a Time object by extracting hours and minutes.
 *
 * @param date - The Date object to convert.
 * @returns A Time object.
 */
export function dateToTime(date: Date): Time {
    return {
        hours: date.getHours(),
        minutes: date.getMinutes(),
    };
}

/**
 * Converts a Time object to a Date object for the current day.
 *
 * @param time - The Time object to convert.
 * @param baseDate - Optional base date to use (defaults to today).
 * @returns A Date object.
 */
export function timeToDate(time: Time, baseDate?: Date): Date {
    const date = baseDate ? new Date(baseDate) : new Date();
    date.setHours(time.hours, time.minutes, 0, 0);
    return date;
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

export * from './types';
