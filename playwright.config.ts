import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // The public Petstore is shared and occasionally flaky, so allow one retry.
  retries: process.env.CI ? 2 : 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.BASE_URL ?? 'https://petstore.swagger.io/v2/',
    extraHTTPHeaders: { Accept: 'application/json' },
    trace: 'retain-on-failure',
  },
});
