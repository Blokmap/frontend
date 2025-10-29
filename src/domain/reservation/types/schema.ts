import type { Location } from '@/domain/location';
import type { OpeningTime } from '@/domain/openings';
import type { Profile } from '@/domain/profile';
import type { Time } from '@/utils/time';

export enum ReservationState {
    Pending = 'pending',
    Created = 'created',
    Rejected = 'rejected',
    Absent = 'absent',
    Present = 'present',
}

export type Reservation = {
    id: string;
    state: ReservationState;
    startTime: Time;
    endTime: Time;
    day: Date;
    createdBy?: Profile;
    location?: Location;
    openingTime?: OpeningTime;
    createdAt: Date;
    updatedAt: Date;
};

export type ReservationGroup = {
    profile: Profile;
    reservations: Reservation[];
};

export type ReservationRequest = {
    openingTimeId: number;
    day: Date;
    startTime: Time;
    endTime: Time;
};

export type ReservationQueueResponse = {
    reservationId: string;
    state: string;
};
