import { describe, expect, it } from 'vitest';
import {
    formatLocationAddress,
    getGoogleMapsDirectionsLink,
    getLocationFeatures,
    getLocationPlaceholderImage,
    locationToRequest,
} from '@/domain/location';
import { createMockLocation, createMockTranslation, createMockOpeningTime } from '../../mocks';

describe('location helpers', () => {
    describe('getLocationPlaceholderImage', () => {
        it('should return placeholder image URL', () => {
            const location = createMockLocation();
            const result = getLocationPlaceholderImage(location);
            expect(result).toBeDefined();
            expect(typeof result).toBe('string');
        });
    });

    describe('locationToRequest', () => {
        it('should convert Location to LocationRequest', () => {
            const location = createMockLocation({
                id: 1,
                name: 'Test Location',
                description: createMockTranslation({ en: 'A test location' }),
                excerpt: createMockTranslation({ en: 'Short description' }),
                seatCount: 50,
                isReservable: true,
                isVisible: true,
                street: 'Main St',
                number: '123',
                zip: '12345',
                city: 'Test City',
                country: 'Test Country',
                latitude: 51.5074,
                longitude: -0.1278,
            });

            const result = locationToRequest(location);

            expect(result.name).toBe('Test Location');
            expect(result.description).toEqual(location.description);
            expect(result.seatCount).toBe(50);
            expect(result.isReservable).toBe(true);
            expect(result.street).toBe('Main St');
            expect(result.number).toBe('123');
            expect(result.latitude).toBe(51.5074);
            expect(result.longitude).toBe(-0.1278);
        });

        it('should extract only editable fields', () => {
            const location = createMockLocation({
                id: 999,
                name: 'Test',
                seatCount: 10,
                isReservable: false,
                isVisible: false,
                street: 'Street',
                number: '1',
                zip: '00000',
                city: 'City',
                country: 'Country',
                latitude: 0,
                longitude: 0,
            });

            const result = locationToRequest(location);

            // Should not include id, createdAt, updatedAt
            expect('id' in result).toBe(false);
            expect('createdAt' in result).toBe(false);
            expect('updatedAt' in result).toBe(false);
        });
    });

    describe('formatLocationAddress', () => {
        it('should format complete address', () => {
            const location = {
                street: 'Main Street',
                number: '123',
                zip: '12345',
                city: 'Amsterdam',
            };

            const result = formatLocationAddress(location);
            expect(result).toBe('Main Street 123, 12345 Amsterdam');
        });

        it('should handle missing fields gracefully', () => {
            const location = createMockLocation({
                street: 'Main Street',
                number: undefined,
                zip: '12345',
                city: 'Amsterdam',
            });

            const result = formatLocationAddress(location);
            expect(result).toContain('Main Street');
            expect(result).toContain('12345');
            expect(result).toContain('Amsterdam');
        });

        it('should handle empty location', () => {
            const location = createMockLocation({
                street: undefined,
                number: undefined,
                zip: undefined,
                city: undefined,
            });

            const result = formatLocationAddress(location);
            expect(result).toBeDefined();
            expect(typeof result).toBe('string');
        });
    });

    describe('getLocationFeatures', () => {
        it('should detect morning opening', () => {
            const location = createMockLocation({
                id: 1,
                name: 'Test',
                openingTimes: [
                    createMockOpeningTime({
                        id: 1,
                        day: new Date(2024, 0, 15),
                        startTime: { hours: 8, minutes: 0 },
                        endTime: { hours: 12, minutes: 0 },
                    }),
                ],
            });

            const features = getLocationFeatures(location);
            expect(features.openInMorning).toBe(true);
        });

        it('should detect evening closing', () => {
            const location = createMockLocation({
                id: 1,
                name: 'Test',
                openingTimes: [
                    createMockOpeningTime({
                        id: 1,
                        day: new Date(2024, 0, 15),
                        startTime: { hours: 12, minutes: 0 },
                        endTime: { hours: 20, minutes: 0 },
                    }),
                ],
            });

            const features = getLocationFeatures(location);
            expect(features.openInEvening).toBe(true);
        });

        it('should handle location without opening times', () => {
            const location = createMockLocation({
                id: 1,
                name: 'Test',
                openingTimes: undefined,
            });

            const features = getLocationFeatures(location);
            expect(features.openAtNight).toBe(false);
            expect(features.openInEvening).toBe(false);
            expect(features.openInMorning).toBe(false);
            expect(features.openInWeekend).toBe(false);
        });

        it('should handle empty opening times array', () => {
            const location = createMockLocation({
                id: 1,
                name: 'Test',
                openingTimes: [],
            });

            const features = getLocationFeatures(location);
            expect(features.openAtNight).toBe(false);
            expect(features.openInEvening).toBe(false);
            expect(features.openInMorning).toBe(false);
            expect(features.openInWeekend).toBe(false);
        });
    });

    describe('getGoogleMapsDirectionsLink', () => {
        it('should generate valid Google Maps URL', () => {
            const location = createMockLocation({
                id: 1,
                name: 'Test Location',
                street: 'Main Street',
                number: '123',
                zip: '12345',
                city: 'Amsterdam',
                country: 'Netherlands',
            });

            const result = getGoogleMapsDirectionsLink(location);

            expect(result).toContain('Main');
            expect(result).toContain('123');
            expect(result).toContain('12345');
            expect(result).toContain('Amsterdam');
        });
    });
});
