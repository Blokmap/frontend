import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';

export type FilterOption = {
    label: string;
    value: string | number | boolean;
    icon?: IconDefinition;
};
