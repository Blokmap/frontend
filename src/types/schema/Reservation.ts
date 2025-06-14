import type { OpeningTime } from '@/types/schema/Location';
import type { Location } from '@/types/schema/Location';
import type { Profile } from '@/types/schema/Profile';

export type Reservation = {
    id: number;
    blockIndex: number;
    startTime: Date;
    endTime: Date;
    profile?: Profile;
    location?: Location;
    openingTime?: OpeningTime;
    confirmedAt: Date | null;
    confirmedBy?: Profile | null;
    createdAt: Date;
    updatedAt: Date;
};
