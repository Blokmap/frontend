export type DateGranularity = 'day' | 'week' | 'month';

/**
 * Calculates the start of the week for a given date.
 * Week starts on Monday and ends on Sunday.
 *
 * @param date - The date to calculate the start of the week for.
 * @returns A new Date object representing the start of the week (Monday).
 */
export function startOfWeek(date: Date): Date {
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
export function endOfWeek(date: Date): Date {
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
 * Formats a date range into a localized string representation.
 *
 * @param start - The start date of the range.
 * @param end - The end date of the range.
 * @param locale - The locale to use for formatting (defaults to 'en').
 * @returns A formatted string representing the date range (e.g., "Jan 1 - Jan 7").
 */
export function formatDateRange(start: Date, end: Date, locale = 'en'): string {
    const options: Intl.DateTimeFormatOptions = {
        month: 'short',
        day: 'numeric',
    };

    if (start.getFullYear() !== end.getFullYear()) {
        options.year = 'numeric';
    }

    return `${start.toLocaleDateString(locale, options)} - ${end.toLocaleDateString(locale, options)}`;
}

/**
 * Formats a date to display the day name in the specified locale.
 *
 * @param date - The date to format.
 * @param weekday - The format for the weekday ('short', 'long', 'narrow').
 * @param locale - The locale to use for formatting (defaults to 'en').
 * @returns A formatted string representing the day name.
 */
export function formatDayName(date: Date, weekday: any = 'short', locale = 'en'): string {
    return date.toLocaleDateString(locale, { weekday });
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
