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

export type OpeningRepetitionConfig = {
    enabled: boolean;
    selectedDays: number[]; // 1 = Monday, 7 = Sunday
    endDate: Date;
};

export type OpeningTimeRequest = {
    sequenceNumber: number | null;
    day: Date;
    startTime: Time;
    endTime: Time;
    seatCount: number | null;
    reservableFrom: Date | null;
    reservableUntil: Date | null;
    repetition?: OpeningRepetitionConfig;
};

export type TimeCell = {
    day: Date;
    startTime: Time;
    endTime: Time;
};

export type TimeSlot<T = any> = {
    id?: string;
    day: Date;
    startTime: Time;
    endTime: Time;
    metadata?: T;
};
