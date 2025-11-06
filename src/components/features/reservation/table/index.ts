import type { Reservation } from '@/domain/reservation/types/reservationSchemaTypes';

export type DayGroup = {
    date: Date;
    dayName: string;
    fullDate: string;
    reservations: Reservation[];
};
