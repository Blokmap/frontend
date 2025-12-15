import type { Image, ImageBody } from '@/domain/image';
import { LocationState, type Location, type LocationRequest } from '@/domain/location';
import type { OpeningTime, OpeningTimeBody } from '@/domain/openings';
import { ProfileState, type Profile } from '@/domain/profile';
import type { Reservation, ReservationState } from '@/domain/reservation';
import type { TimeSlot, TimeSlottable } from '@/domain/calendar';
import type { Translation } from '@/domain/translation';
import type { Authority } from '@/domain/authority';
import { InstitutionCategory, type Institution } from '@/domain/institution';

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
        id: '1',
        avatar: null,
        username: 'testuser',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        institution: null,
        authorities: [],
        createdAt: new Date('2024-01-01'),
        isAdmin: false,
        state: ProfileState.Active,
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
 * Mock factory for ImageBody objects
 */
export function createMockImageBody(overrides?: Partial<ImageBody>): ImageBody {
    return {
        id: 1,
        imageUrl: 'https://example.com/image.jpg',
        tempUrl: null,
        file: null,
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
        state: LocationState.Approved,
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
 * Mock factory for OpeningTimeBody objects
 */
export function createMockOpeningTimeBody(overrides?: Partial<OpeningTimeBody>): OpeningTimeBody {
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
        id: '1',
        state: 'Created' as ReservationState,
        day: new Date('2024-01-15'),
        startTime: { hours: 9, minutes: 0 },
        endTime: { hours: 17, minutes: 0 },
        createdBy: createMockProfile(),
        location: createMockLocation(),
        openingTime: undefined,
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
        day: new Date('2024-01-15'),
        startTime: { hours: 9, minutes: 0 },
        endTime: { hours: 17, minutes: 0 },
        metadata: undefined,
        ...overrides,
    };
}

/**
 * Mock factory for Authority objects
 */
export function createMockAuthority(overrides?: Partial<Authority>): Authority {
    return {
        id: 1,
        name: 'Test Authority',
        logo: null,
        description: 'A test authority',
        createdBy: null,
        updatedBy: null,
        members: [],
        locations: [],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        ...overrides,
    };
}

/**
 * Mock factory for Institution objects
 */
export function createMockInstitution(overrides?: Partial<Institution>): Institution {
    return {
        id: 1,
        logo: null,
        slug: 'test-institution',
        name: createMockTranslation({ en: 'Test Institution', nl: 'Test Institutie' }),
        email: 'test@institution.com',
        phone: '+1234567890',
        street: 'Institution Street',
        number: '1',
        zip: '12345',
        city: 'Test City',
        province: 'Test Province',
        country: 'Test Country',
        category: InstitutionCategory.Education,
        aclType: 'Whitelist',
        ...overrides,
    };
}
