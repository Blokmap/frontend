import type { Time } from '@/utils/date/time';

export type OpeningTime = {
    id: number;
    startTime: Time;
    endTime: Time;
    seatCount: number | null;
    reservableFrom: Date | null;
    reservableUntil: Date | null;
    createdBy?: any | null; // Profile - avoiding circular import
    updatedBy?: any | null; // Profile - avoiding circular import
    createdAt: Date;
    updatedAt: Date;
};

export type OpeningTimeRequest = {
    startTime: Time;
    endTime: Time;
    day: Date;
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
