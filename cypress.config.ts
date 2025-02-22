// cypress.config.ts
import { defineConfig } from 'cypress';

export default defineConfig({
    e2e: {
        specPattern: 'test/e2e/**/*.cy.ts',
        fixturesFolder: 'test/cy/fixtures',
        supportFile: 'test/cy/support/e2e.ts',
        screenshotsFolder: 'test/cy/screenshots',
    },
});
