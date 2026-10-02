import { test, expect } from '@playwright/test';

test.describe('1. Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.clear();
      localStorage.setItem('pulseboard_auth_state', 'false');
    });
  });

  test('should display login form elements', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByTestId('login-email')).toBeVisible();
    await expect(page.getByTestId('login-password')).toBeVisible();
    await expect(page.getByTestId('login-submit')).toBeVisible();
  });

  test('should display error message on invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('login-email').fill('invalid@pulseboard.io');
    await page.getByTestId('login-password').fill('invalid-pass');
    await page.getByTestId('login-submit').click();

    await expect(page.getByTestId('login-error')).toBeVisible();
    await expect(page.getByTestId('login-error')).toContainText('Invalid login credentials');
  });

  test('should successfully log in with valid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('login-email').fill('alex.morgan@pulseboard.io');
    await page.getByTestId('login-password').fill('password123');
    await page.getByTestId('login-submit').click();

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByTestId('dashboard-page')).toBeVisible();
  });

  test('should redirect unauthenticated users from protected routes to login', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });
});
