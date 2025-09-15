/// <reference types="cypress" />

// Custom Commands for Blokmap E2E Tests

/**
 * Login command to authenticate a user
 */
Cypress.Commands.add('login', (email: string, password: string) => {
    cy.visit('/auth/login');
    cy.get('[data-cy=email-input]').type(email);
    cy.get('[data-cy=password-input]').type(password);
    cy.get('[data-cy=login-button]').click();

    // Wait for successful login redirect
    cy.url().should('not.include', '/auth');
});

/**
 * Mock geolocation to a specific position
 */
Cypress.Commands.add('mockGeolocation', (latitude: number, longitude: number) => {
    cy.window().then((win) => {
        cy.stub(win.navigator.geolocation, 'getCurrentPosition').callsFake((success) => {
            success({
                coords: {
                    latitude,
                    longitude,
                    accuracy: 10,
                    altitude: null,
                    altitudeAccuracy: null,
                    heading: null,
                    speed: null,
                },
                timestamp: Date.now(),
            });
        });
    });
});

/**
 * Wait for map to be loaded and ready
 */
Cypress.Commands.add('waitForMap', () => {
    cy.get('[data-cy=map-container]').should('be.visible');
    cy.wait(1000); // Give map time to initialize
});

/**
 * Intercept API calls for testing
 */
Cypress.Commands.add('mockApiCalls', () => {
    // Mock locations API
    cy.intercept('GET', '**/locations*', { fixture: 'locations.json' }).as('getLocations');

    // Mock auth API
    cy.intercept('POST', '**/auth/login', {
        statusCode: 200,
        body: {
            user: { id: 1, email: 'test@example.com', name: 'Test User' },
            token: 'mock-jwt-token',
        },
    }).as('loginRequest');

    // Mock reservations API
    cy.intercept('GET', '**/reservations*', { fixture: 'reservations.json' }).as('getReservations');
});

/**
 * Navigate to a specific week in calendar
 */
Cypress.Commands.add('navigateToWeek', (date: string) => {
    cy.get('[data-cy=calendar-controls]').within(() => {
        cy.get('[data-cy=date-picker-toggle]').click();
        cy.get('[data-cy=date-picker]').should('be.visible');
        cy.get(`[data-date="${date}"]`).click();
    });
});

/**
 * Test VIM keyboard controls
 */
Cypress.Commands.add('testVimControls', () => {
    cy.get('body').type('j'); // Should move to next week
    cy.get('body').type('k'); // Should move to previous week
    cy.get('body').type('{leftarrow}'); // Should navigate left
    cy.get('body').type('{rightarrow}'); // Should navigate right
});

declare global {
    namespace Cypress {
        interface Chainable {
            /**
             * Login with email and password
             */
            login(email: string, password: string): Chainable<void>;

            /**
             * Mock geolocation to specific coordinates
             */
            mockGeolocation(latitude: number, longitude: number): Chainable<void>;

            /**
             * Wait for map component to load
             */
            waitForMap(): Chainable<void>;

            /**
             * Mock common API calls
             */
            mockApiCalls(): Chainable<void>;

            /**
             * Navigate to specific week in calendar
             */
            navigateToWeek(date: string): Chainable<void>;

            /**
             * Test VIM keyboard controls
             */
            testVimControls(): Chainable<void>;
        }
    }
}
