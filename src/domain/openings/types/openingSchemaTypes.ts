import type { TimeSlotRepetition } from '@/domain/calendar';
import type { Profile } from '@/domain/profile';
import type { Time } from '@/utils/time';

export type OpeningTimeStats = {
    reservationCount: number;
    occupancy: Record<number, number>;
};

export type OpeningTime = {
    id: number;
    startTime: Time;
    endTime: Time;
    day: Date;
    seatCount: number | null;
    reservableFrom: Date | null;
    reservableUntil: Date | null;
    createdAt: Date;
    updatedAt: Date;
    sequenceId: string | null;
    stats?: OpeningTimeStats;
    createdBy?: Profile;
    updatedBy?: Profile | null;
};

export type OpeningTimeRequest = {
    id?: number;
    sequenceId?: string | null;
    day: Date;
    startTime: Time;
    endTime: Time;
    seatCount: number | null;
    reservableFrom: Date | null;
    reservableUntil: Date | null;
    repetition?: TimeSlotRepetition;
};
