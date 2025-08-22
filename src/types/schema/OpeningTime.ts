import type { Profile } from '@/types/schema/Profile';

export type Time = `${string}${string}:${string}${string}`;

export type OpeningTime = {
    id: number;
    startTime: Time;
    endTime: Time;
    seatCount: number | null;
    reservableFrom: Date | null;
    reservableUntil: Date | null;
    createdBy?: Profile | null;
    updatedBy?: Profile | null;
    createdAt: Date;
    updatedAt: Date;
};

export type CreateOpeningTimeRequest = {
    startTime: Time;
    endTime: Time;
    day: Date;
    seatCount: number | null;
    reservableFrom: Date | null;
    reservableUntil: Date | null;
};

export type CreateOpeningTimeGroupRequest = {
    type: 'daily' | 'weekly';
    startDate: Date;
    endDate: Date;
    selectedDays: number[];
    timeSlots: { startTime: Time; endTime: Time; seatCount: number }[];
};
