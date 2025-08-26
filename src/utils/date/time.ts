export type Time = {
    hours: number;
    minutes: number;
};

export type TimeRange = {
    startTime: Time;
    endTime: Time;
};

export type TimeGranularity = 'hours' | 'minutes';

/**
 * Converts a Time object to a string in HH:MM format.
 *
 * @param time - The Time object to convert.
 * @returns A string in HH:MM format.
 */
export function timeToString(time?: Time | null): string | undefined | null {
    if (!time) return time;
    return `${time.hours.toString().padStart(2, '0')}:${time.minutes.toString().padStart(2, '0')}`;
}

/**
 * Converts a string in HH:MM format to a Time object.
 *
 * @param timeString - The time string in HH:MM format.
 * @returns A Time object.
 */
export function stringToTime(timeString?: string): Time | null | undefined {
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
 * Validates and corrects a time range to ensure end time is after start time.
 * If end time is before start time, it assumes the end time is on the next day.
 *
 * @param startTime - The start time.
 * @param endTime - The end time.
 * @returns A corrected time range.
 */
export function validateTimeRange(startTime: Time, endTime: Time): TimeRange {
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);

    // If end time is before start time, assume it's the next day
    if (endMinutes <= startMinutes) {
        return {
            startTime,
            endTime: minutesToTime(endMinutes + 24 * 60), // Add 24 hours
        };
    }

    return { startTime, endTime };
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
