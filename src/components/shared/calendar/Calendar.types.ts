import type { Time } from '@/types/schema/OpeningTime';

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
