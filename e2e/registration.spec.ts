import { test, expect } from '@playwright/test';

test.describe('2. Registration Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.clear();
      localStorage.setItem('pulseboard_auth_state', 'false');
    });
  });

  test('should display registration form elements', async ({ page }) => {
    await page.goto('/register');
    await expect(page.getByTestId('register-fullname')).toBeVisible();
    await expect(page.getByTestId('register-email')).toBeVisible();
    await expect(page.getByTestId('register-password')).toBeVisible();
    await expect(page.getByTestId('register-confirm-password')).toBeVisible();
    await expect(page.getByTestId('register-terms')).toBeVisible();
    await expect(page.getByTestId('register-submit')).toBeVisible();
  });

  test('should register a new account successfully', async ({ page }) => {
    await page.goto('/register');
    const timestamp = Date.now();
    await page.getByTestId('register-fullname').fill('Test User');
    await page.getByTestId('register-email').fill(`test.user.${timestamp}@pulseboard.io`);
    await page.getByTestId('register-password').fill('StrongPass123!');
    await page.getByTestId('register-confirm-password').fill('StrongPass123!');

    await page.getByTestId('register-terms').check();
    await page.getByTestId('register-submit').click();

    await expect(page.getByTestId('register-success')).toBeVisible();
    await expect(page.getByTestId('register-success')).toContainText(
      'Account created successfully'
    );

    await expect(page).toHaveURL(/\/verify-email/, { timeout: 10000 });
  });
});
