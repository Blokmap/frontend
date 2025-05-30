import { OpeningTime } from '@/types/model/Location';
import { Profile } from '@/types/model/Profile';
import { DateTime } from 'luxon';
import { Location } from '@/types/model/Location';
import { z, type ZodType } from 'zod/v4';
import { datetime } from '@/utils/zod';

export type Reservation = {
    id: number;
    blockIndex: number;
    startTime: DateTime;
    endTime: DateTime;
    profile?: Profile;
    location?: Location;
    openingTime?: OpeningTime;
    confirmedAt: DateTime | null;
    confirmedBy?: Profile | null;
    createdAt: DateTime;
    updatedAt: DateTime;
};

export const Reservation: ZodType<Reservation> = z.lazy(() =>
    z.object({
        id: z.number(),
        blockIndex: z.number(),
        startTime: datetime,
        endTime: datetime,
        profile: Profile.optional(),
        location: Location.optional(),
        openingTime: OpeningTime.optional(),
        confirmedAt: datetime.nullable(),
        confirmedBy: Profile.optional().nullable(),
        createdAt: datetime,
        updatedAt: datetime,
    }),
);
