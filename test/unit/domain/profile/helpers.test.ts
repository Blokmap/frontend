import { describe, expect, it } from 'vitest';
import { getProfileInitials } from '@/domain/profile';
import { createMockProfile } from '../../mocks';

describe('profile helpers', () => {
    describe('getProfileInitials', () => {
        it('should return initials from first and last name', () => {
            const profile = createMockProfile({
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
            });

            expect(getProfileInitials(profile)).toBe('JD');
        });

        it('should handle lowercase names', () => {
            const profile = createMockProfile({
                id: 1,
                firstName: 'alice',
                lastName: 'smith',
            });

            expect(getProfileInitials(profile)).toBe('as');
        });

        it('should handle both names missing', () => {
            const profile = createMockProfile({
                id: 1,
                firstName: null,
                lastName: null,
            });

            expect(getProfileInitials(profile)).toBe('');
        });

        it('should handle missing first name', () => {
            const profile = createMockProfile({
                id: 1,
                firstName: null,
                lastName: 'Doe',
            });

            expect(getProfileInitials(profile)).toBe('D');
        });

        it('should handle missing last name', () => {
            const profile = createMockProfile({
                id: 1,
                firstName: 'John',
                lastName: null,
            });

            expect(getProfileInitials(profile)).toBe('J');
        });

        it('should handle empty string names', () => {
            const profile = createMockProfile({
                id: 1,
                firstName: '',
                lastName: '',
            });

            expect(getProfileInitials(profile)).toBe('');
        });

        it('should handle names with multiple words', () => {
            const profile = createMockProfile({
                id: 1,
                firstName: 'Mary Jane',
                lastName: 'Watson Parker',
            });

            expect(getProfileInitials(profile)).toBe('MW');
        });

        it('should handle special characters', () => {
            const profile = createMockProfile({
                id: 1,
                firstName: 'Ólafur',
                lastName: 'Þórðarson',
            });

            expect(getProfileInitials(profile)).toBe('ÓÞ');
        });
    });
});
