describe('Visit Example Website', () => {
    it('should load the homepage', () => {
        cy.visit('https://example.cypress.io');

        cy.title().should('include', 'Cypress');
    });
});
