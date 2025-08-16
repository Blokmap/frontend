import type { Location, OpeningTime } from '@/types/schema/Location';
import type { Profile } from '@/types/schema/Profile';

export enum ReservationState {
    Created = 'Created',
    Absent = 'Absent',
    Present = 'Present',
    Cancelled = 'Cancelled',
}

export type Reservation = {
    id: number;
    state: ReservationState;
    blockIndex: number;
    startTime: Date;
    endTime: Date;
    profile?: Profile;
    location?: Location;
    openingTime?: OpeningTime;
    confirmedAt: Date | null;
    confirmedBy?: Profile | null;
    createdAt: Date;
    updatedAt: Date;
};

export interface TimeSlot<T = any> {
    id: string;
    day: Date;
    startTime: string;
    endTime: string;
    duration: {
        hours: number;
        minutes: number;
    };
    metadata?: T;
}
