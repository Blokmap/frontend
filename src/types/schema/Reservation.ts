import type { Location } from '@/types/schema/Location';
import type { OpeningTime } from '@/types/schema/OpeningTime';
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
