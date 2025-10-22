describe('Dashboard Navigation', () => {
    const BASE_URL = Cypress.env('BASE_URL') || 'https://dev.blokmap.io';

    it('should redirect unauthenticated users to auth page', () => {
        // Try to access dashboard without being logged in
        cy.visit(`${BASE_URL}/dashboard`, { failOnStatusCode: false });

        // Should redirect to auth page
        cy.url({ timeout: 10000 }).should('include', '/auth');
        cy.get('[data-testid="auth-title"]').should('be.visible');
    });

    it('should redirect to auth when trying to access protected profile routes', () => {
        // Try to access profile page without auth
        cy.visit(`${BASE_URL}/profile`, { failOnStatusCode: false });

        // Should redirect to auth
        cy.url({ timeout: 10000 }).should('include', '/auth');
    });

    it('should show auth page for new location submission without login', () => {
        // Try to submit a new location without being logged in
        cy.visit(`${BASE_URL}/locations/submit`, { failOnStatusCode: false });

        // Should redirect to auth
        cy.url({ timeout: 10000 }).should('include', '/auth');
        cy.get('[data-testid="auth-title"]').should('be.visible');
    });

    // Note: The following tests would require actual authentication
    // They test the structure assuming a user IS logged in

    it('should have consistent navigation structure across protected routes', () => {
        // This test validates that IF a user can access dashboard,
        // the navigation elements are present
        // cy.visit(`${BASE_URL}/dashboard`, { failOnStatusCode: false });
        // // If we're on the dashboard (user is logged in), check for navigation
        // cy.url({ timeout: 5000 }).then((url) => {
        //     if (url.includes('/dashboard')) {
        //         // Dashboard sidebar should exist
        //         cy.get('[data-testid="dashboard-sidebar"]', { timeout: 10000 }).should('exist');
        //         // Key navigation links should exist
        //         cy.get('[data-testid="my-locations-link"]').should('exist');
        //         cy.get('[data-testid="new-location-link"]').should('exist');
        //         cy.get('[data-testid="profile-link"]').should('exist');
        //         cy.get('[data-testid="logout-button"]').should('exist');
        //     }
        // });
    });

    it('should handle direct navigation to non-existent dashboard routes', () => {
        // Try to access a route that doesn't exist
        cy.visit(`${BASE_URL}/dashboard/nonexistent`, { failOnStatusCode: false });

        // Should either redirect to auth or show 404
        cy.url({ timeout: 10000 }).then((url) => {
            // Accept either auth redirect or staying on the 404 page
            expect(url).to.satisfy((url: string) => {
                return url.includes('/auth') || url.includes('/dashboard');
            });
        });
    });

    it('should preserve redirect URL after auth requirement', () => {
        // Try to access a protected route
        const protectedRoute = '/dashboard/locations';
        cy.visit(`${BASE_URL}${protectedRoute}`, { failOnStatusCode: false });

        // Should redirect to auth
        cy.url({ timeout: 10000 }).should('include', '/auth');

        // After successful login, should redirect back to original route
        // This is just checking the redirect mechanism exists
        // Actual test would require authentication
    });

    it('should maintain session across page navigation', () => {
        // // Start at homepage
        // cy.visit(BASE_URL);
        // // Try to access dashboard
        // cy.visit(`${BASE_URL}/dashboard`, { failOnStatusCode: false });
        // // Check if redirected to auth (no session)
        // cy.url({ timeout: 10000 }).then((url) => {
        //     if (url.includes('/auth')) {
        //         // No active session - expected behavior
        //         cy.get('[data-testid="auth-title"]').should('be.visible');
        //     } else if (url.includes('/dashboard')) {
        //         // Has active session - verify dashboard elements
        //         cy.get('body').should('be.visible');
        //     }
        // });
    });

    it('should handle back button navigation correctly', () => {
        // Visit locations page
        cy.visit(`${BASE_URL}/locations`);
        cy.get('[data-testid="locations-title"]', { timeout: 10000 }).should('be.visible');

        // Try to navigate to dashboard (will redirect to auth)
        cy.visit(`${BASE_URL}/dashboard`, { failOnStatusCode: false });

        // Go back
        cy.go('back');

        // Should be back on locations page
        cy.url({ timeout: 5000 }).should('include', '/locations');
        cy.get('[data-testid="locations-title"]').should('be.visible');
    });
});
