import type { Time } from '@/utils/time';

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

/**
 * Calendar drag interaction types
 */

/** The mode of dragging interaction */
export type CalendarDragMode = 'move' | 'resize';

/** State for calendar drag operations */
export type CalendarDragState<T = any> = {
    isDragging: boolean;
    slot: TimeSlot<T> | null;
    mode: CalendarDragMode;
    startPosition: { x: number; y: number };
};

/** Position and dimensions for a calendar slot */
export type CalendarSlotPosition = {
    top: string;
    height: string;
};

/** Configuration for calendar drag functionality */
export type CalendarDragConfig = {
    enableDragging: boolean;
    minSlotDuration: number;
    pixelsPerHour: number;
};
