import { expect, test } from "@playwright/test"

test("landing page exposes scaffold actions", async ({ page }) => {
  await page.goto("/")

  await expect(
    page.getByRole("heading", { name: "Image Tagger 2026" })
  ).toBeVisible()
  await expect(page.getByRole("link", { name: "Sign in" })).toBeVisible()
  await expect(page.getByRole("link", { name: "Open dashboard" })).toBeVisible()
})

test("user can sign up and reach protected dashboard", async ({
  page,
}, testInfo) => {
  const email = `e2e-${testInfo.project.name}-${Date.now()}@example.com`

  await page.goto("/sign-in")
  await page.getByRole("button", { name: "Need an account? Sign up" }).click()
  await page.getByLabel("Name").fill("E2E User")
  await page.getByLabel("Email").fill(email)
  await page.getByLabel("Password").fill("supersecurepassword")
  await page.getByRole("button", { name: "Create account" }).click()

  await expect(page).toHaveURL(/\/dashboard$/)
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible()
})
