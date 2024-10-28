import { test, expect } from '@playwright/test';

test.beforeEach(async ({page}) => {
  await page.goto('/');
})

test('Has link to registration', async ({ page }) => {
  await expect(page).toHaveURL("/login");
});

test('Navigate to registration page correctly', async ({ page }) => {
  await page.getByText('Click here').click()
  await expect(page).toHaveURL("/registration");
});

