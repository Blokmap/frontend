import { faCircleCheck, faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import { faUserCheck, faUserXmark, faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { ReservationState } from './types';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export const RESERVATION_BLOCK_SIZE_MINUTES = 5;

export const RESERVATION_STATE_ICONS: Record<ReservationState, IconDefinition> = {
    [ReservationState.Pending]: faCircleNotch,
    [ReservationState.Created]: faCircleCheck,
    [ReservationState.Present]: faUserCheck,
    [ReservationState.Absent]: faUserXmark,
    [ReservationState.Rejected]: faCircleXmark,
};

export const RESERVATION_STATES = Object.values(ReservationState);
