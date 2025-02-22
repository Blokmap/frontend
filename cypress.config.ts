// cypress.config.ts
import { defineConfig } from 'cypress';

export default defineConfig({
    e2e: {
        specPattern: 'test/e2e/**/*.cy.ts',
        fixturesFolder: 'test/e2e/fixtures',
        supportFile: 'test/e2e/support/e2e.ts',
        screenshotsFolder: 'test/e2e/screenshots',
    },
});
