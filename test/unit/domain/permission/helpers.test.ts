import { describe, expect, it } from 'vitest';
import {
    checkPermissions,
    LocationPermission,
    AuthorityPermission,
    InstitutionPermission,
} from '@/domain/auth';

describe('Permission Helpers', () => {
    describe('checkPermissions', () => {
        describe('LocationPermission', () => {
            it('should return true when user has the exact permission', () => {
                const actual = LocationPermission.ManageImages;
                const expected = LocationPermission.ManageImages;
                expect(checkPermissions(actual, expected)).toBe(true);
            });

            it('should return false when user does not have the permission', () => {
                const actual = LocationPermission.ManageImages;
                const expected = LocationPermission.ManageOpeningTimes;
                expect(checkPermissions(actual, expected)).toBe(false);
            });

            it('should return true when user has Administrator permission', () => {
                const actual = LocationPermission.Administrator;
                const expected = LocationPermission.ManageImages;
                expect(checkPermissions(actual, expected)).toBe(true);
            });

            it('should return true when user has multiple permissions including the expected one', () => {
                const actual =
                    LocationPermission.ManageImages | LocationPermission.ManageOpeningTimes;
                const expected = LocationPermission.ManageImages;
                expect(checkPermissions(actual, expected)).toBe(true);
            });

            it('should return false when user has multiple permissions but not the expected one', () => {
                const actual =
                    LocationPermission.ManageImages | LocationPermission.ManageOpeningTimes;
                const expected = LocationPermission.ManageMembers;
                expect(checkPermissions(actual, expected)).toBe(false);
            });

            it('should return true when user has all expected multiple permissions', () => {
                const actual =
                    LocationPermission.ManageImages |
                    LocationPermission.ManageOpeningTimes |
                    LocationPermission.ManageMembers;
                const expected =
                    LocationPermission.ManageImages | LocationPermission.ManageOpeningTimes;
                expect(checkPermissions(actual, expected)).toBe(true);
            });

            it('should return false when user has only some of the expected multiple permissions', () => {
                const actual = LocationPermission.ManageImages;
                const expected =
                    LocationPermission.ManageImages | LocationPermission.ManageOpeningTimes;
                expect(checkPermissions(actual, expected)).toBe(false);
            });

            it('should return true when user has all location permissions', () => {
                const actual =
                    LocationPermission.Administrator |
                    LocationPermission.ManageImages |
                    LocationPermission.ManageOpeningTimes |
                    LocationPermission.ManageMembers |
                    LocationPermission.ManageReservations;
                const expected =
                    LocationPermission.ManageImages | LocationPermission.ManageReservations;
                expect(checkPermissions(actual, expected)).toBe(true);
            });

            it('should return true when checking for no permissions (0)', () => {
                const actual = LocationPermission.ManageImages;
                const expected = 0;
                expect(checkPermissions(actual, expected)).toBe(true);
            });

            it('should return true when both actual and expected are 0', () => {
                const actual = 0;
                const expected = 0;
                expect(checkPermissions(actual, expected)).toBe(true);
            });
        });

        describe('AuthorityPermission', () => {
            it('should return true when user has the exact permission', () => {
                const actual = AuthorityPermission.AddLocations;
                const expected = AuthorityPermission.AddLocations;
                expect(checkPermissions(actual, expected)).toBe(true);
            });

            it('should return false when user does not have the permission', () => {
                const actual = AuthorityPermission.AddLocations;
                const expected = AuthorityPermission.ApproveLocations;
                expect(checkPermissions(actual, expected)).toBe(false);
            });

            it('should return true when user has Administrator permission', () => {
                const actual = AuthorityPermission.Administrator;
                const expected = AuthorityPermission.AddLocations;
                expect(checkPermissions(actual, expected)).toBe(true);
            });

            it('should return true when user has multiple permissions including the expected one', () => {
                const actual =
                    AuthorityPermission.AddLocations | AuthorityPermission.ApproveLocations;
                const expected = AuthorityPermission.AddLocations;
                expect(checkPermissions(actual, expected)).toBe(true);
            });

            it('should return false when user has multiple permissions but not the expected one', () => {
                const actual =
                    AuthorityPermission.AddLocations | AuthorityPermission.ApproveLocations;
                const expected = AuthorityPermission.ManageMembers;
                expect(checkPermissions(actual, expected)).toBe(false);
            });

            it('should return true when user has all expected multiple permissions', () => {
                const actual =
                    AuthorityPermission.AddLocations |
                    AuthorityPermission.ApproveLocations |
                    AuthorityPermission.DeleteLocations;
                const expected =
                    AuthorityPermission.AddLocations | AuthorityPermission.ApproveLocations;
                expect(checkPermissions(actual, expected)).toBe(true);
            });

            it('should return false when user has only some of the expected multiple permissions', () => {
                const actual = AuthorityPermission.AddLocations;
                const expected =
                    AuthorityPermission.AddLocations | AuthorityPermission.DeleteLocations;
                expect(checkPermissions(actual, expected)).toBe(false);
            });

            it('should return true when user has all authority permissions', () => {
                const actual =
                    AuthorityPermission.Administrator |
                    AuthorityPermission.AddLocations |
                    AuthorityPermission.ApproveLocations |
                    AuthorityPermission.DeleteLocations |
                    AuthorityPermission.ManageMembers;
                const expected =
                    AuthorityPermission.ApproveLocations | AuthorityPermission.DeleteLocations;
                expect(checkPermissions(actual, expected)).toBe(true);
            });
        });

        describe('InstitutionPermission', () => {
            it('should return true when user has the exact permission', () => {
                const actual = InstitutionPermission.AddAuthority;
                const expected = InstitutionPermission.AddAuthority;
                expect(checkPermissions(actual, expected)).toBe(true);
            });

            it('should return false when user does not have the permission', () => {
                const actual = InstitutionPermission.AddAuthority;
                const expected = InstitutionPermission.DeleteAuthority;
                expect(checkPermissions(actual, expected)).toBe(false);
            });

            it('should return true when user has Administrator permission', () => {
                const actual = InstitutionPermission.Administrator;
                const expected = InstitutionPermission.AddAuthority;
                expect(checkPermissions(actual, expected)).toBe(true);
            });

            it('should return true when user has multiple permissions including the expected one', () => {
                const actual =
                    InstitutionPermission.AddAuthority | InstitutionPermission.DeleteAuthority;
                const expected = InstitutionPermission.AddAuthority;
                expect(checkPermissions(actual, expected)).toBe(true);
            });

            it('should return false when user has multiple permissions but not the expected one', () => {
                const actual =
                    InstitutionPermission.AddAuthority | InstitutionPermission.DeleteAuthority;
                const expected = InstitutionPermission.ManageMembers;
                expect(checkPermissions(actual, expected)).toBe(false);
            });

            it('should return true when user has all expected multiple permissions', () => {
                const actual =
                    InstitutionPermission.AddAuthority |
                    InstitutionPermission.DeleteAuthority |
                    InstitutionPermission.ManageMembers;
                const expected =
                    InstitutionPermission.AddAuthority | InstitutionPermission.DeleteAuthority;
                expect(checkPermissions(actual, expected)).toBe(true);
            });

            it('should return false when user has only some of the expected multiple permissions', () => {
                const actual = InstitutionPermission.AddAuthority;
                const expected =
                    InstitutionPermission.AddAuthority | InstitutionPermission.ManageMembers;
                expect(checkPermissions(actual, expected)).toBe(false);
            });

            it('should return true when user has all institution permissions', () => {
                const actual =
                    InstitutionPermission.Administrator |
                    InstitutionPermission.AddAuthority |
                    InstitutionPermission.DeleteAuthority |
                    InstitutionPermission.ManageMembers;
                const expected =
                    InstitutionPermission.AddAuthority | InstitutionPermission.DeleteAuthority;
                expect(checkPermissions(actual, expected)).toBe(true);
            });
        });

        describe('Edge cases and combinations', () => {
            it('should work with raw bitmask values', () => {
                const actual = 0b1010; // Has bits 1 and 3
                const expected = 0b1000; // Expects bit 3
                expect(checkPermissions(actual, expected)).toBe(true);
            });

            it('should return false when raw bitmask does not match', () => {
                const actual = 0b1010; // Has bits 1 and 3
                const expected = 0b0100; // Expects bit 2
                expect(checkPermissions(actual, expected)).toBe(false);
            });

            it('should handle maximum permission combinations', () => {
                const actual = (1 << 0) | (1 << 1) | (1 << 2) | (1 << 3) | (1 << 4) | (1 << 5);
                const expected = (1 << 2) | (1 << 4);
                expect(checkPermissions(actual, expected)).toBe(true);
            });

            it('should correctly use bitwise AND operation', () => {
                // Test the core logic: (actual & expected) === expected
                const actual = 0b1111; // All first 4 bits set
                const expected = 0b0101; // Bits 0 and 2 set
                expect(checkPermissions(actual, expected)).toBe(true);
                expect(actual & expected).toBe(expected);
            });

            it('should fail when bitwise AND does not equal expected', () => {
                const actual = 0b1010; // Bits 1 and 3 set
                const expected = 0b0101; // Bits 0 and 2 set
                expect(checkPermissions(actual, expected)).toBe(false);
                expect(actual & expected).not.toBe(expected);
            });
        });
    });
});
