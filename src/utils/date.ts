export type DateGranularity = 'day' | 'week' | 'month';

export function startOfWeek(date: Date): Date {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
}

export function endOfWeek(date: Date): Date {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? 0 : 7);
    return new Date(date.setDate(diff));
}

export function startOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function endOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export function daysInRange(start: Date, end: Date): Date[] {
    const days: Date[] = [];
    const current = new Date(start);

    while (current <= end) {
        days.push(new Date(current));
        current.setDate(current.getDate() + 1);
    }

    return days;
}

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

export function isDateInRange(date: Date, start: Date, end: Date): boolean {
    return date >= start && date <= end;
}

export function formatTimeFromDate(date: Date): string {
    return date.toTimeString().slice(0, 5);
}

export function formatTimeFromHoursAndMinutes(hours: number, minutes: number): string {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

export function startOfDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

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

export function formatDayName(date: Date, weekday: any = 'short', locale = 'en'): string {
    return date.toLocaleDateString(locale, { weekday });
}

export function isToday(date: Date): boolean {
    const today = new Date();
    return (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
    );
}
