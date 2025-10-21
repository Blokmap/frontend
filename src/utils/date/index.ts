export * from './convert';
export * from './format';

export type DateGranularity = 'day' | 'week' | 'month';

/**
 * Calculates the start of the week for a given date.
 * Week starts on Monday and ends on Sunday.
 *
 * @param date - The date to calculate the start of the week for.
 * @returns A new Date object representing the start of the week (Monday).
 */
export function startOfWeek(date: Date = new Date()): Date {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
}

/**
 * Calculates the end of the week for a given date.
 * Week starts on Monday and ends on Sunday.
 *
 * @param date - The date to calculate the end of the week for.
 * @returns A new Date object representing the end of the week (Sunday).
 */
export function endOfWeek(date: Date = new Date()): Date {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? 0 : 7);
    return new Date(date.setDate(diff));
}

/**
 * Calculates the start of the month for a given date.
 *
 * @param date - The date to calculate the start of the month for.
 * @returns A new Date object representing the first day of the month.
 */
export function startOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

/**
 * Calculates the end of the month for a given date.
 *
 * @param date - The date to calculate the end of the month for.
 * @returns A new Date object representing the last day of the month.
 */
export function endOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

/**
 * Generates an array of dates within a specified range (inclusive).
 *
 * @param start - The start date of the range.
 * @param end - The end date of the range.
 * @returns An array of Date objects representing each day in the range.
 */
export function datesInRange(start: Date, end: Date): Date[] {
    const days = [];
    const current = new Date(start);

    while (current <= end) {
        const day = new Date(current);
        days.push(day);
        current.setDate(current.getDate() + 1);
    }

    return days;
}

/**
 * Adds a specified amount of time to a date based on the given granularity.
 *
 * @param date - The base date to add time to.
 * @param amount - The amount to add (can be negative for subtraction).
 * @param granularity - The unit of time to add ('day', 'week', or 'month').
 * @returns A new Date object with the specified amount added.
 */
export function addToDate(date: Date, amount: number, granularity: DateGranularity = 'day'): Date {
    const newDate = new Date(date);

    switch (granularity) {
        case 'day':
            newDate.setDate(newDate.getDate() + amount);
            break;
        case 'week':
            newDate.setDate(newDate.getDate() + amount * 7);
            break;
        case 'month':
            newDate.setMonth(newDate.getMonth() + amount);
            break;
    }

    return newDate;
}

/**
 * Checks if a date falls within a specified date range (inclusive).
 *
 * @param date - The date to check.
 * @param start - The start date of the range.
 * @param end - The end date of the range.
 * @returns True if the date is within the range, false otherwise.
 */
export function isDateInRange(date: Date, start: Date, end: Date): boolean {
    return date >= start && date <= end;
}

/**
 * Creates a new Date object representing the start of the day (00:00:00).
 *
 * @param date - The date to get the start of day for.
 * @returns A new Date object set to the beginning of the day.
 */
export function startOfDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * Checks if a given date is today.
 *
 * @param date - The date to check.
 * @returns True if the date is today, false otherwise.
 */
export function isToday(date: Date): boolean {
    const today = new Date();
    return (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
    );
}

/**
 * Checks if a given date falls on a weekend (Saturday or Sunday).
 *
 * @param day - The date to check.
 * @returns True if the date is a weekend, false otherwise.
 */
export function isWeekend(day: Date): boolean {
    return day.getDay() === 0 || day.getDay() === 6;
}

/**
 * Checks if two dates fall on the same calendar day.
 *
 * @param date1 - The first date to compare.
 * @param date2 - The second date to compare.
 * @returns True if both dates are on the same day, false otherwise.
 */
export function isSameDay(date1: Date, date2: Date): boolean {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
}
