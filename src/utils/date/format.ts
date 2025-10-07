export type WeekdayFormat = 'short' | 'long' | 'narrow';

/**
 * Formats a date to display the day name in the specified locale.
 *
 * @param date - The date to format.
 * @param weekday - The format for the weekday ('short', 'long', 'narrow').
 * @param locale - The locale to use for formatting (defaults to 'en').
 * @returns A formatted string representing the day name.
 */
export function formatDayName(
    day: Date | number,
    weekday: WeekdayFormat = 'short',
    locale: string = 'en',
): string {
    const date = day instanceof Date ? day : new Date(2024, 0, 1 + day);
    return date.toLocaleDateString(locale, { weekday });
}
