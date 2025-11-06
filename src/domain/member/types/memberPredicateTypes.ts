/**
 * A predicate function that evaluates permissions.
 * Used for building complex permission checks with logical operators.
 */
export type Predicate = (perms: number) => boolean;
