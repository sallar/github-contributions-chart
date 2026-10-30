const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.js",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  use: {
    baseURL: "http://127.0.0.1:3097",
    trace: "retain-on-failure"
  },
  projects: [
    ...["light", "dark"].map((colorScheme) => ({
      name: `desktop-${colorScheme}`,
      use: { ...devices["Desktop Chrome"], colorScheme }
    })),
    ...["light", "dark"].map((colorScheme) => ({
      name: `mobile-${colorScheme}`,
      use: { ...devices["iPhone 13"], colorScheme }
    }))
  ],
  webServer: {
    command: "npm run start -- --hostname 127.0.0.1 --port 3097",
    url: "http://127.0.0.1:3097",
    reuseExistingServer: !process.env.CI
  }
});
