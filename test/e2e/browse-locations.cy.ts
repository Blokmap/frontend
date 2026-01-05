describe('User Journey - Browse and Reserve Location', () => {
    const BASE_URL = Cypress.env('BASE_URL') || 'https://dev.blokmap.io';

    it('should navigate from homepage to locations page', () => {
        cy.visit(BASE_URL);

        // Homepage should redirect to /locations
        cy.url({ timeout: 10000 }).should('include', '/locations');

        // Should show locations title
        cy.get('[data-testid="locations-title"]', { timeout: 10000 }).should('be.visible');
    });

    it('should display location cards and map', () => {
        cy.visit(`${BASE_URL}/locations`);

        // Should have location grid
        cy.get('[data-testid="locations-grid"]', { timeout: 10000 }).should('be.visible');

        // Should have map
        cy.get('[data-testid="locations-map"]', { timeout: 10000 }).should('be.visible');

        // Should have at least one location card link
        cy.get('[data-testid="location-card-link"]').should('have.length.at.least', 1);
    });

    it('should open location detail page', () => {
        cy.visit(`${BASE_URL}/locations`);

        // Click first location card
        cy.get('[data-testid="location-card-link"]', { timeout: 10000 })
            .first()
            .should('be.visible')
            .click();

        // Should navigate to detail page
        cy.url().should('match', /\/locations\/\d+/);

        // Should show location name
        cy.get('[data-testid="location-name"]', { timeout: 10000 }).should('be.visible');
    });

    it('should show auth page when accessing dashboard without login', () => {
        cy.visit(`${BASE_URL}/dashboard`, { failOnStatusCode: false });

        // Should redirect to auth
        cy.url({ timeout: 10000 }).should('include', '/auth');

        // Should show auth title
        cy.get('[data-testid="auth-title"]', { timeout: 10000 }).should('be.visible');
    });

    it('should display auth page with institution selector', () => {
        cy.visit(`${BASE_URL}/auth`);

        // Should show auth title
        cy.get('[data-testid="auth-title"]', { timeout: 10000 }).should('be.visible');

        // Should have institution selector
        cy.get('[data-testid="institution-select"]').should('be.visible');
    });
});
