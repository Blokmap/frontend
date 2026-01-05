// Re-export from auth domain for backward compatibility
export {
    checkPermissions,
    isAdministrator,
    extractPermissions,
} from '@/domain/auth/helpers/permissionHelpers';
export { any, all, not, blank, has } from '@/domain/auth/helpers/predicates';
