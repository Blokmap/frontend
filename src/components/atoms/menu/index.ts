import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export type SelectOption<T> = {
    label: string;
    value: T;
    icon?: IconDefinition;
};
