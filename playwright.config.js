// @ts-check
const { devices } = require('@playwright/test');

/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  webServer: {
    command: 'node tests/server.js',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
  testDir: './tests',
};

module.exports = config;
