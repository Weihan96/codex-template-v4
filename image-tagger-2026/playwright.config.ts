import { defineConfig, devices } from "@playwright/test"

const baseURL = "http://127.0.0.1:3010"

export default defineConfig({
  testDir: "./tests/e2e",
  outputDir: ".tmp/playwright/test-results",
  fullyParallel: true,
  workers: 1,
  timeout: 60_000,
  expect: {
    timeout: 15_000,
  },
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "desktop-firefox",
      use: {
        ...devices["Desktop Firefox"],
      },
    },
    {
      name: "mobile-firefox",
      use: {
        ...devices["Pixel 5"],
        browserName: "firefox",
      },
    },
  ],
  webServer: {
    command: "bun run build && bun run start -- --port 3010",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
  },
  reporter: [
    ["list"],
    ["html", { outputFolder: ".tmp/playwright/html-report", open: "never" }],
  ],
})
