import { z } from 'zod/v4';
import { DateTime } from 'luxon';

export const datetime = z.iso.datetime().transform((val) => DateTime.fromISO(val));
