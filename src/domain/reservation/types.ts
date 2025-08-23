import type { Location } from '@/domain/location';
import type { OpeningTime } from '@/domain/openingTime';
import type { Profile } from '@/domain/profile';
import type { Time } from '@/utils/date/time';

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
    startTime: Time;
    endTime: Time;
    day: Date;
    profile?: Profile;
    location?: Location;
    openingTime?: OpeningTime;
    confirmedAt: Date | null;
    confirmedBy?: Profile | null;
    createdAt: Date;
    updatedAt: Date;
};
