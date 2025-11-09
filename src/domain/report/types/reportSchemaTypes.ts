import type { Location } from '@/domain/location';
import type { Profile } from '@/domain/profile';

export type Report = {
    reason: string;
    createdBy?: Profile;
    createdAt: Date;
};

export type LocationReport = Report & {
    location: Location;
};
