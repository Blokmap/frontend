export * from './role';
export * from './auth';
export * from './permission';
export * from './predicate';

export type AuthSettings = {
    required?: boolean;
    admin?: boolean;
    authority?: unknown;
    location?: unknown;
    institution?: unknown;
};
