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
    date: Date,
    weekday: WeekdayFormat = 'short',
    locale: string = 'en',
): string {
    return date.toLocaleDateString(locale, { weekday });
}

/**
 * Formats a weekday number (0-6) to its corresponding name in the specified locale.
 *
 * @param num - The weekday number (0 for Monday, 1 for Tuesday, ..., 6 for Sunday).
 * @param format - The format for the weekday ('short', 'long', 'narrow').
 * @param locale - The locale to use for formatting (defaults to 'en').
 * @returns A formatted string representing the day name.
 */
export function formatWeekdayNumber(
    num: number,
    format: WeekdayFormat = 'short',
    locale: string = 'en',
): string {
    const referenceDate = new Date(2024, 0, 1 + num);
    return referenceDate.toLocaleDateString(locale, { weekday: format });
}
