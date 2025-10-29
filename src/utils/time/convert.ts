import type { Time } from './types';

/**
 * Checks if a string is in HH:MM time format.
 *
 * @param value - The string to check.
 * @returns True if the string is in HH:MM format, false otherwise.
 */
export function isTimeString(value: string): boolean {
    return /^\d{1,2}:\d{2}(:\d{2})?$/.test(value);
}

/**
 * Checks if a value is a Time object.
 *
 * @param value - The value to check.
 * @returns True if the value is a Time object, false otherwise.
 */
export function isTimeObject(value: any): value is Time {
    return (
        value &&
        typeof value === 'object' &&
        typeof value.hours === 'number' &&
        typeof value.minutes === 'number' &&
        value.hours >= 0 &&
        value.hours < 24 &&
        value.minutes >= 0 &&
        value.minutes < 60
    );
}

/**
 * Converts a Time object to a string in HH:MM format.
 *
 * @param time - The Time object to convert.
 * @param compact - If true, returns a compact format (e.g., "14u" or "14u30").
 * @returns A string in HH:MM format or compact format.
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
