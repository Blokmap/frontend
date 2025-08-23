export type Time = `${string}${string}:${string}${string}`;

export type TimeRange = {
    startTime: Time;
    endTime: Time;
};

export type TimeGranularity = 'hours' | 'minutes';
/**
 * Formats a Date object to a time string in HH:MM format.
 *
 * @param date - The date to format.
 * @returns A string representing the time in HH:MM format.
 */
export function dateToTime(date: Date): Time {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}` as Time;
}

/**
 * Converts a Time string to a Date object with time set on a base date.
 *
 * @param time - The time string in HH:MM format.
 * @param baseDate - The base date to set the time on (defaults to '2000-01-01').
 * @returns A Date object with the specified time.
 */
export function timeToDate(time: Time, baseDate: Date = new Date('2000-01-01')): Date {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date(baseDate);
    date.setHours(hours, minutes, 0, 0);
    return date;
}

/**
 * Calculates the duration between two Date objects.
 *
 * @param startTime - The start time.
 * @param endTime - The end time.
 * @returns A Duration object with hours and minutes.
 */
export function calculateDuration(
    startTime: Date,
    endTime: Date,
): { hours: number; minutes: number } {
    const durationMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;

    return {
        hours,
        minutes,
    };
}

/**
 * Parses a time string in various formats to an object with hours and minutes.
 * Supports both 12-hour (AM/PM) and 24-hour formats.
 *
 * @param timeString - The time string to parse (e.g., "14:30", "2:30 PM").
 * @returns An object with hours and minutes in 24-hour format.
 */
export function parseTimeString(timeString: string): { hours: number; minutes: number } {
    if (timeString.includes('AM') || timeString.includes('PM')) {
        const cleanTime = timeString.replace(/\s*(AM|PM)/i, '');
        const [hourStr, minuteStr] = cleanTime.split(':');

        let hours = parseInt(hourStr);
        const minutes = parseInt(minuteStr) || 0;

        // Convert to 24-hour format
        const isPM = timeString.includes('PM');

        if (isPM && hours !== 12) {
            hours += 12;
        } else if (!isPM && hours === 12) {
            hours = 0;
        }

        return { hours, minutes };
    }

    const [hours, minutes] = timeString.split(':').map(Number);
    return { hours, minutes };
}

/**
 * Converts hours and minutes to total minutes.
 *
 * @param hours - The hours.
 * @param minutes - The minutes.
 * @returns Total minutes.
 */
export function toTotalMinutes(hours: number, minutes: number): number {
    return hours * 60 + minutes;
}

/**
 * Converts total minutes to hours and minutes.
 *
 * @param totalMinutes - The total minutes.
 * @returns An object with hours and minutes.
 */
export function fromTotalMinutes(totalMinutes: number): { hours: number; minutes: number } {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return { hours, minutes };
}

/**
 * Adds time to a Date object following the same pattern as addToDate.
 *
 * @param date - The base date.
 * @param amount - The amount to add.
 * @param unit - The unit to add ('minutes', 'hours').
 * @returns A new Date object with the time added.
 */
export function addToTime(date: Date, amount: number, unit: TimeGranularity): Date {
    const newDate = new Date(date);

    switch (unit) {
        case 'minutes':
            newDate.setMinutes(newDate.getMinutes() + amount);
            break;
        case 'hours':
            newDate.setHours(newDate.getHours() + amount);
            break;
    }

    return newDate;
}

/**
 * Creates a new Date object with specific time set on a given date.
 *
 * @param date - The base date.
 * @param hours - The hours to set.
 * @param minutes - The minutes to set.
 * @returns A new Date object with the time set.
 */
export function setTimeOnDate(date: Date, hours: number, minutes: number): Date {
    const newDate = new Date(date);
    newDate.setHours(hours, minutes, 0, 0);
    return newDate;
}

/**
 * Creates a Time string from hours and minutes.
 *
 * @param hours - The hours (0-23).
 * @param minutes - The minutes (0-59).
 * @returns A Time string in HH:mm format.
 */
export function createTime(hours: number, minutes: number): Time {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}` as Time;
}

/**
 * Adds hours to a Time string.
 *
 * @param time - The original time string.
 * @param hours - The number of hours to add.
 * @returns A new Time string with the hours added.
 */
export function addHoursToTime(time: Time, hours: number): Time {
    const date = timeToDate(time);
    date.setHours(date.getHours() + hours);
    return dateToTime(date);
}

/**
 * Compares two Time strings.
 *
 * @param time1 - The first time string.
 * @param time2 - The second time string.
 * @returns A negative number if time1 < time2, positive if time1 > time2, 0 if equal.
 */
export function compareTime(time1: Time, time2: Time): number {
    const date1 = timeToDate(time1);
    const date2 = timeToDate(time2);
    return date1.getTime() - date2.getTime();
}

/**
 * Validates that end time is after start time, correcting if necessary.
 *
 * @param startTime - The start time string.
 * @param endTime - The end time string.
 * @returns An object with corrected start and end times.
 */
export function validateTimeRange(
    startTime: Time,
    endTime: Time,
): { startTime: Time; endTime: Time } {
    if (compareTime(endTime, startTime) <= 0) {
        return {
            startTime,
            endTime: addHoursToTime(startTime, 1),
        };
    }
    return { startTime, endTime };
}
