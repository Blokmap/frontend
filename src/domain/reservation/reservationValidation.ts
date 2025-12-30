import { v } from '@/utils/forms/validation';

/**
 * Validation rules for ReservationRequest
 */
export const reservationRequestValidation = {
    openingTimeId: {
        required: v.required('openingTimeId'),
        numeric: v.numeric('openingTimeId'),
    },
    state: {},
    day: {
        required: v.required('day'),
    },
    startTime: {
        required: v.required('startTime'),
    },
    endTime: {
        required: v.required('endTime'),
        endTimeAfterStartTime: v.endTimeAfterStartTime,
    },
};

export type ReservationRequestValidation = typeof reservationRequestValidation;
