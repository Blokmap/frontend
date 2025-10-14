import type { Image, ImageRequest } from '@/domain/image';
import type { Location, LocationRequest } from '@/domain/location';
import type { OpeningTime, OpeningTimeRequest } from '@/domain/openings';
import type { Profile } from '@/domain/profile';
import type { Reservation, ReservationState } from '@/domain/reservation';
import type { TimeSlot, TimeSlottable } from '@/domain/calendar';
import type { Translation } from '@/domain/translation';

/**
 * Mock factory for Translation objects
 */
export function createMockTranslation(overrides?: Partial<Translation>): Translation {
    return {
        id: 'trans-1',
        en: 'Test Translation',
        nl: 'Test Vertaling',
        fr: 'Test Traduction',
        de: 'Test Übersetzung',
        ...overrides,
    };
}

/**
 * Mock factory for Profile objects
 */
export function createMockProfile(overrides?: Partial<Profile>): Profile {
    return {
        id: 1,
        avatarUrl: null,
        username: 'testuser',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        institution: null,
        authorities: [],
        createdAt: new Date('2024-01-01'),
        isAdmin: false,
        state: 'active',
        ...overrides,
    };
}

/**
 * Mock factory for Image objects
 */
export function createMockImage(overrides?: Partial<Image>): Image {
    return {
        id: 1,
        url: 'https://example.com/image.jpg',
        index: 0,
        ...overrides,
    };
}

/**
 * Mock factory for ImageRequest objects
 */
export function createMockImageRequest(overrides?: Partial<ImageRequest>): ImageRequest {
    return {
        id: 1,
        imageUrl: 'https://example.com/image.jpg',
        tempUrl: null,
        file: null,
        isPrimary: false,
        index: 0,
        ...overrides,
    };
}

/**
 * Mock factory for Location objects
 */
export function createMockLocation(overrides?: Partial<Location>): Location {
    return {
        id: 1,
        name: 'Test Location',
        state: 'approved',
        excerpt: createMockTranslation(),
        description: createMockTranslation(),
        seatCount: 50,
        minReservationLength: null,
        maxReservationLength: null,
        isReservable: true,
        isVisible: true,
        street: 'Main Street',
        number: '123',
        zip: '12345',
        city: 'Test City',
        country: 'Test Country',
        province: 'Test Province',
        latitude: 51.5074,
        longitude: -0.1278,
        openingTimes: [],
        approvedAt: new Date('2024-01-01'),
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        rejectedAt: null,
        rejectedReason: null,
        approvedBy: null,
        createdBy: null,
        updatedBy: null,
        rejectedBy: null,
        images: [],
        ...overrides,
    };
}

/**
 * Mock factory for OpeningTime objects
 */
export function createMockOpeningTime(overrides?: Partial<OpeningTime>): OpeningTime {
    return {
        id: 1,
        day: new Date('2024-01-15'),
        startTime: { hours: 9, minutes: 0 },
        endTime: { hours: 17, minutes: 0 },
        seatCount: 50,
        reservableFrom: null,
        reservableUntil: null,
        sequenceId: null,
        createdBy: undefined,
        updatedBy: undefined,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        ...overrides,
    };
}

/**
 * Mock factory for OpeningTimeRequest objects
 */
export function createMockOpeningTimeRequest(
    overrides?: Partial<OpeningTimeRequest>,
): OpeningTimeRequest {
    return {
        id: undefined,
        sequenceId: null,
        day: new Date('2024-01-15'),
        startTime: { hours: 9, minutes: 0 },
        endTime: { hours: 17, minutes: 0 },
        seatCount: 50,
        reservableFrom: null,
        reservableUntil: null,
        repetition: undefined,
        ...overrides,
    };
}

/**
 * Mock factory for Reservation objects
 */
export function createMockReservation(overrides?: Partial<Reservation>): Reservation {
    return {
        id: 1,
        state: 'Created' as ReservationState,
        blockIndex: 0,
        day: new Date('2024-01-15'),
        startTime: { hours: 9, minutes: 0 },
        endTime: { hours: 17, minutes: 0 },
        createdBy: createMockProfile(),
        location: createMockLocation(),
        openingTime: undefined,
        confirmedAt: null,
        confirmedBy: null,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        ...overrides,
    };
}

/**
 * Mock factory for TimeSlottable objects
 */
export function createMockTimeSlottable(overrides?: Partial<TimeSlottable>): TimeSlottable {
    return {
        day: new Date('2024-01-15'),
        startTime: { hours: 9, minutes: 0 },
        endTime: { hours: 17, minutes: 0 },
        repetition: undefined,
        ...overrides,
    };
}

/**
 * Mock factory for TimeSlot objects
 */
export function createMockTimeSlot<T = any>(overrides?: Partial<TimeSlot<T>>): TimeSlot<T> {
    return {
        id: 'timeslot-1',
        day: new Date('2024-01-15'),
        startTime: { hours: 9, minutes: 0 },
        endTime: { hours: 17, minutes: 0 },
        metadata: undefined,
        ...overrides,
    };
}
