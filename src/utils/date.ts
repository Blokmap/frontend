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
