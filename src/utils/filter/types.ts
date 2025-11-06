import type { IconDefinition } from '@fortawesome/fontawesome-common-types';

export type FilterOption = {
    label: string;
    value: string | number | boolean;
    icon?: IconDefinition;
};
