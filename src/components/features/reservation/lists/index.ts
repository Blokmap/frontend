import type { Reservation } from '@/domain/reservation/types/schema';

export type DayGroup = {
    date: Date;
    dayName: string;
    fullDate: string;
    reservations: Reservation[];
};
