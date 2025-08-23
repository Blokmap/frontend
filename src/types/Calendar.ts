import type { Time } from '@/utils/date/time';

export type CalendarTimeSlot<T = any> = {
    id: string;
    day: Date;
    startTime: Time;
    endTime: Time;
    duration: {
        hours: number;
        minutes: number;
    };
    metadata?: T;
};
