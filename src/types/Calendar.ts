import type { Time } from '@/utils/date/time';

export type CalendarDragState = {
    isDragging: boolean;
    slot: TimeSlot<any> | null;
    mode: 'move' | 'resize';
    startPosition: { x: number; y: number };
    originalTimes: { start: Time; end: Time; day: Date };
    lastEmitted: { start: Time; end: Time; day: Date | null };
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
