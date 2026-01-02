import { faTrash, faUserCheck, faUserSlash } from '@fortawesome/free-solid-svg-icons';
import { ProfileState } from './types';

export const PROFILE_STATES = Object.values(ProfileState);

export const PROFILE_STATE_ICONS = {
    [ProfileState.Active]: faUserCheck,
    [ProfileState.Disabled]: faUserSlash,
    [ProfileState.Deleted]: faTrash,
};
