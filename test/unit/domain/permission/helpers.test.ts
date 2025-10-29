import { describe, expect, it } from 'vitest';
import { checkPermissions, LocationPermissions, AuthorityPermissions, InstitutionPermissions } from '@/domain/permission';

describe('Permission Helpers', () => {
    describe('checkPermissions', () => {
        describe('LocationPermissions', () => {
            it('should return true when user has the exact permission', () => {
                const actual = LocationPermissions.ManageImages;
                const expected = LocationPermissions.ManageImages;
                expect(checkPermissions(actual, expected)).toBe(true);
            });

            it('should return false when user does not have the permission', () => {
                const actual = LocationPermissions.ManageImages;
                const expected = LocationPermissions.ManageOpeningTimes;
                expect(checkPermissions(actual, expected)).toBe(false);
            });

            it('should return true when user has Administrator permission', () => {
                const actual = LocationPermissions.Administrator;
                const expected = LocationPermissions.ManageImages;
                expect(checkPermissions(actual, expected)).toBe(true);
            });

            it('should return true when user has multiple permissions including the expected one', () => {
                const actual = LocationPermissions.ManageImages | LocationPermissions.ManageOpeningTimes;
                const expected = LocationPermissions.ManageImages;
                expect(checkPermissions(actual, expected)).toBe(true);
            });

            it('should return false when user has multiple permissions but not the expected one', () => {
                const actual = LocationPermissions.ManageImages | LocationPermissions.ManageOpeningTimes;
                const expected = LocationPermissions.ManageMembers;
                expect(checkPermissions(actual, expected)).toBe(false);
            });

            it('should return true when user has all expected multiple permissions', () => {
                const actual = LocationPermissions.ManageImages | LocationPermissions.ManageOpeningTimes | LocationPermissions.ManageMembers;
                const expected = LocationPermissions.ManageImages | LocationPermissions.ManageOpeningTimes;
                expect(checkPermissions(actual, expected)).toBe(true);
            });

            it('should return false when user has only some of the expected multiple permissions', () => {
                const actual = LocationPermissions.ManageImages;
                const expected = LocationPermissions.ManageImages | LocationPermissions.ManageOpeningTimes;
                expect(checkPermissions(actual, expected)).toBe(false);
            });

            it('should return true when user has all location permissions', () => {
                const actual = LocationPermissions.Administrator |
                    LocationPermissions.ManageImages |
                    LocationPermissions.ManageOpeningTimes |
                    LocationPermissions.ManageMembers |
                    LocationPermissions.ManageReservations;
                const expected = LocationPermissions.ManageImages | LocationPermissions.ManageReservations;
                expect(checkPermissions(actual, expected)).toBe(true);
            });

            it('should return true when checking for no permissions (0)', () => {
                const actual = LocationPermissions.ManageImages;
                const expected = 0;
                expect(checkPermissions(actual, expected)).toBe(true);
            });

            it('should return true when both actual and expected are 0', () => {
                const actual = 0;
                const expected = 0;
                expect(checkPermissions(actual, expected)).toBe(true);
            });
        });

        describe('AuthorityPermissions', () => {
            it('should return true when user has the exact permission', () => {
                const actual = AuthorityPermissions.AddLocations;
                const expected = AuthorityPermissions.AddLocations;
                expect(checkPermissions(actual, expected)).toBe(true);
            });

            it('should return false when user does not have the permission', () => {
                const actual = AuthorityPermissions.AddLocations;
                const expected = AuthorityPermissions.ApproveLocations;
                expect(checkPermissions(actual, expected)).toBe(false);
            });

            it('should return true when user has Administrator permission', () => {
                const actual = AuthorityPermissions.Administrator;
                const expected = AuthorityPermissions.AddLocations;
                expect(checkPermissions(actual, expected)).toBe(true);
            });

            it('should return true when user has multiple permissions including the expected one', () => {
                const actual = AuthorityPermissions.AddLocations | AuthorityPermissions.ApproveLocations;
                const expected = AuthorityPermissions.AddLocations;
                expect(checkPermissions(actual, expected)).toBe(true);
            });

            it('should return false when user has multiple permissions but not the expected one', () => {
                const actual = AuthorityPermissions.AddLocations | AuthorityPermissions.ApproveLocations;
                const expected = AuthorityPermissions.ManageMembers;
                expect(checkPermissions(actual, expected)).toBe(false);
            });

            it('should return true when user has all expected multiple permissions', () => {
                const actual = AuthorityPermissions.AddLocations | AuthorityPermissions.ApproveLocations | AuthorityPermissions.DeleteLocations;
                const expected = AuthorityPermissions.AddLocations | AuthorityPermissions.ApproveLocations;
                expect(checkPermissions(actual, expected)).toBe(true);
            });

            it('should return false when user has only some of the expected multiple permissions', () => {
                const actual = AuthorityPermissions.AddLocations;
                const expected = AuthorityPermissions.AddLocations | AuthorityPermissions.DeleteLocations;
                expect(checkPermissions(actual, expected)).toBe(false);
            });

            it('should return true when user has all authority permissions', () => {
                const actual = AuthorityPermissions.Administrator |
                    AuthorityPermissions.AddLocations |
                    AuthorityPermissions.ApproveLocations |
                    AuthorityPermissions.DeleteLocations |
                    AuthorityPermissions.ManageMembers;
                const expected = AuthorityPermissions.ApproveLocations | AuthorityPermissions.DeleteLocations;
                expect(checkPermissions(actual, expected)).toBe(true);
            });
        });

        describe('InstitutionPermissions', () => {
            it('should return true when user has the exact permission', () => {
                const actual = InstitutionPermissions.AddAuthority;
                const expected = InstitutionPermissions.AddAuthority;
                expect(checkPermissions(actual, expected)).toBe(true);
            });

            it('should return false when user does not have the permission', () => {
                const actual = InstitutionPermissions.AddAuthority;
                const expected = InstitutionPermissions.DeleteAuthority;
                expect(checkPermissions(actual, expected)).toBe(false);
            });

            it('should return true when user has Administrator permission', () => {
                const actual = InstitutionPermissions.Administrator;
                const expected = InstitutionPermissions.AddAuthority;
                expect(checkPermissions(actual, expected)).toBe(true);
            });

            it('should return true when user has multiple permissions including the expected one', () => {
                const actual = InstitutionPermissions.AddAuthority | InstitutionPermissions.DeleteAuthority;
                const expected = InstitutionPermissions.AddAuthority;
                expect(checkPermissions(actual, expected)).toBe(true);
            });

            it('should return false when user has multiple permissions but not the expected one', () => {
                const actual = InstitutionPermissions.AddAuthority | InstitutionPermissions.DeleteAuthority;
                const expected = InstitutionPermissions.ManageMembers;
                expect(checkPermissions(actual, expected)).toBe(false);
            });

            it('should return true when user has all expected multiple permissions', () => {
                const actual = InstitutionPermissions.AddAuthority | InstitutionPermissions.DeleteAuthority | InstitutionPermissions.ManageMembers;
                const expected = InstitutionPermissions.AddAuthority | InstitutionPermissions.DeleteAuthority;
                expect(checkPermissions(actual, expected)).toBe(true);
            });

            it('should return false when user has only some of the expected multiple permissions', () => {
                const actual = InstitutionPermissions.AddAuthority;
                const expected = InstitutionPermissions.AddAuthority | InstitutionPermissions.ManageMembers;
                expect(checkPermissions(actual, expected)).toBe(false);
            });

            it('should return true when user has all institution permissions', () => {
                const actual = InstitutionPermissions.Administrator |
                    InstitutionPermissions.AddAuthority |
                    InstitutionPermissions.DeleteAuthority |
                    InstitutionPermissions.ManageMembers;
                const expected = InstitutionPermissions.AddAuthority | InstitutionPermissions.DeleteAuthority;
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
                expect((actual & expected)).toBe(expected);
            });

            it('should fail when bitwise AND does not equal expected', () => {
                const actual = 0b1010; // Bits 1 and 3 set
                const expected = 0b0101; // Bits 0 and 2 set
                expect(checkPermissions(actual, expected)).toBe(false);
                expect((actual & expected)).not.toBe(expected);
            });
        });
    });
});
