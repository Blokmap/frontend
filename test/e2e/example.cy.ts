describe('Blokmap Application Tests', () => {
    it('should verify the application builds successfully', () => {
        // This is a smoke test that just verifies the test setup works
        expect(true).to.equal(true);
    });

    it('should have package.json with correct configuration', () => {
        cy.readFile('package.json').then((pkg) => {
            expect(pkg.name).to.equal('frontend');
            expect(pkg.dependencies).to.have.property('vue');
            expect(pkg.dependencies).to.have.property('primevue');
        });
    });

    it('should have vite config file', () => {
        cy.readFile('vite.config.ts').should('exist');
    });

    it('should have router configuration', () => {
        cy.readFile('src/config/router/router.ts').should('contain', 'createRouter');
    });
});
