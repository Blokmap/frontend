export function formatDate(date: Date | string, format: string = 'YYYY-MM-DD'): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
}