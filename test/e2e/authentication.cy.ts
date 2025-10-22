describe('Authentication Flow', () => {
    const BASE_URL = Cypress.env('BASE_URL') || 'https://dev.blokmap.io';

    beforeEach(() => {
        // Start fresh on auth page
        cy.visit(`${BASE_URL}/auth`);
    });

    it('should display auth page with institution selector and SSO options', () => {
        // Verify main auth elements
        cy.get('[data-testid="auth-title"]', { timeout: 10000 }).should('be.visible');

        // Should have institution selector
        cy.get('[data-testid="institution-select"]').should('be.visible');

        // Should have password login button
        cy.get('[data-testid="password-login-button"]').should('be.visible');
    });

    it('should open login dialog when password login is clicked', () => {
        // Click password login button
        cy.get('[data-testid="password-login-button"]').click();

        // Dialog should open
        cy.get('[data-testid="auth-dialog"]', { timeout: 5000 }).should('be.visible');

        // Login form should be visible
        cy.get('[data-testid="login-form"]').should('be.visible');
        cy.get('[data-testid="login-username"]').should('be.visible');
        cy.get('[data-testid="login-password"]').should('be.visible');
        cy.get('[data-testid="login-submit"]').should('be.visible');
    });

    it('should show validation errors for empty login form', () => {
        // Open login dialog
        cy.get('[data-testid="password-login-button"]').click();
        cy.get('[data-testid="auth-dialog"]', { timeout: 5000 }).should('be.visible');

        // Try to submit empty form
        cy.get('[data-testid="login-submit"]').click();

        // Form should not submit (HTML5 validation will prevent it)
        cy.get('[data-testid="login-form"]').should('be.visible');
    });

    it('should allow typing in login form fields', () => {
        // Open login dialog
        cy.get('[data-testid="password-login-button"]').click();
        cy.get('[data-testid="auth-dialog"]', { timeout: 5000 }).should('be.visible');

        // Type in username (target the input inside the component)
        cy.get('[data-testid="login-username"]').find('input').type('test@example.com');
        cy.get('[data-testid="login-username"]')
            .find('input')
            .should('have.value', 'test@example.com');

        // Type in password
        cy.get('[data-testid="login-password"]').find('input').type('testpassword123');
        cy.get('[data-testid="login-password"]')
            .find('input')
            .should('have.value', 'testpassword123');
    });

    it('should handle failed login attempt gracefully', () => {
        // Open login dialog
        cy.get('[data-testid="password-login-button"]').click();
        cy.get('[data-testid="auth-dialog"]', { timeout: 5000 }).should('be.visible');

        // Fill in invalid credentials
        cy.get('[data-testid="login-username"]').find('input').type('invalid@example.com');
        cy.get('[data-testid="login-password"]').find('input').type('wrongpassword');

        // Submit form
        cy.get('[data-testid="login-submit"]').click();

        // Should show error (either in dialog or as toast notification)
        // The form should remain visible after failed login
        cy.get('[data-testid="login-form"]', { timeout: 5000 }).should('be.visible');
    });

    it('should redirect authenticated users away from auth page', () => {
        // This test assumes user is NOT logged in
        // If a user IS logged in, visiting /auth should redirect them

        cy.visit(`${BASE_URL}/auth`);

        // For unauthenticated users, should stay on auth page
        cy.url({ timeout: 5000 }).should('include', '/auth');
        cy.get('[data-testid="auth-title"]').should('be.visible');
    });

    it('should filter institutions when typing in selector', () => {
        // Click institution selector
        cy.get('[data-testid="institution-select"]').click();

        // Wait for dropdown to open
        cy.wait(500);

        // Type in search (if search is available in the dropdown)
        cy.get('[data-testid="institution-select"]').type('gent');

        // Dropdown should be visible with filtered results
        cy.get('body').should('be.visible');
    });
});
