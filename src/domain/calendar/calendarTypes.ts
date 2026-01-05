import type { Time } from '@/utils/time';

export type TimeCell = {
    day: Date;
    startTime: Time;
    endTime: Time;
};

export type TimeSlot<T = any> = {
    day: Date;
    startTime: Time;
    endTime: Time;
    metadata?: T;
};

export type TimeSlotRepetition = {
    // 1 (Monday) to 7 (Sunday)
    selectedDays: number[];
    // The date until which the repetition is valid
    endDate: Date;
};

export type TimeSlottable = {
    day: Date;
    startTime: Time;
    endTime: Time;
    repetition?: TimeSlotRepetition;
};
