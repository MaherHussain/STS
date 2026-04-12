import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle("STS");
});

test('can navigate to login', async ({ page }) => {
  await page.goto('/');
  const body = page.locator('body');
  await expect(body).toBeVisible();
});
