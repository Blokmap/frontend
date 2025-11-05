import type { Predicate } from '../types';

// Functions for building permission predicates

export function any(...predicates: Predicate[]): Predicate {
    return (perms: number) => predicates.some((predicate) => predicate(perms));
}

export function all(...predicates: Predicate[]): Predicate {
    return (perms: number) => predicates.every((predicate) => predicate(perms));
}

export function not(predicate: Predicate): Predicate {
    return (perms: number) => !predicate(perms);
}

export function blank(): Predicate {
    return (_perms: number) => true;
}
