import { v, optional } from '@/utils/forms/validation';

/**
 * Validation rules for OpeningTimeRequest
 */
export const openingTimeRequestValidation = {
    id: {
        numeric: optional(v.numeric('id')),
    },
    sequenceId: {},
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
    seatCount: {
        numeric: optional(v.numeric('seatCount')),
        minValue: optional(v.minValue('seatCount', 1)),
    },
    reservableFrom: {},
    reservableUntil: {},
    repetition: {},
};

export type OpeningTimeRequestValidation = typeof openingTimeRequestValidation;
