import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 150 * 1000,
  fullyParallel: false,

  expect: {
    timeout: 150 * 1000,
  },

  reporter: 'html',

  use: {
    browserName: 'chromium',
    headless: false,
  },

  projects: [
    {
      name: 'Inews Mobile Chrome (Android)',
      testMatch :/inews.spec.js/,
      use: {
        ...devices['Pixel 5'],
        locale: 'en-GB',
        timezoneId: 'Europe/London',
        extraHTTPHeaders: {
          'Accept-Language': 'en-GB,en;q=0.9',
        },
        geolocation: { latitude: 51.5074, longitude: -0.1278 },
        permissions: ['geolocation'],
      },
    },
    {
      name: 'Inews Mobile Safari (iOS)',
      testMatch : /inews.spec.js/,
      use: {
        ...devices['iPhone 12'],
        locale: 'en-GB',
        timezoneId: 'Europe/London',
        extraHTTPHeaders: {
          'Accept-Language': 'en-GB,en;q=0.9',
        },
        geolocation: { latitude: 51.5074, longitude: -0.1278 },
        permissions: ['geolocation'],
      },
    },
    {
      name: 'Desktop Chrome (UK Dark)',
      testMatch: /newscientist.spec.js/,
      use: {
        ...devices['Desktop Chrome'],
        locale: 'en-GB',
        timezoneId: 'Europe/London',
        extraHTTPHeaders: { 'Accept-Language': 'en-GB,en;q=0.9' },
        colorScheme: 'dark',   // emulates prefers-color-scheme: dark
        isMobile: false,
        hasTouch: false,
      },
    },
  ],
});
