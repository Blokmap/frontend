import type { TimeSlotRepetition } from '@/domain/calendar';
import type { Profile } from '@/domain/profile';
import type { Time } from '@/utils/time';

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
    sequenceNumber: number | null;
    repetition?: TimeSlotRepetition;
};
