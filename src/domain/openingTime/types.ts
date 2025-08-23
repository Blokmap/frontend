import type { Profile } from '../profile';
import type { Time } from '@/utils/date/time';

export type OpeningTime = {
    id: number;
    startTime: Time;
    endTime: Time;
    day: Date;
    seatCount: number | null;
    reservableFrom: Date | null;
    reservableUntil: Date | null;
    createdBy?: Profile;
    updatedBy?: Profile | null;
    createdAt: Date;
    updatedAt: Date;
};

export type OpeningTimeRequest = {
    day: Date;
    startTime: Time;
    endTime: Time;
    seatCount: number | null;
    reservableFrom: Date | null;
    reservableUntil: Date | null;
};

export type OpeningTimeGroupRequest = {
    type: 'daily' | 'weekly';
    startDate: Date;
    endDate: Date;
    selectedDays: number[];
    timeSlots: { startTime: Time; endTime: Time; seatCount: number }[];
};
