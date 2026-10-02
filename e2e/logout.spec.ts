import { test, expect } from '@playwright/test';

test.describe('11. Logout Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.clear();
      localStorage.setItem('pulseboard_auth_state', 'true');
      localStorage.setItem(
        'pulseboard_mock_user',
        JSON.stringify({
          id: 'usr_mock_123',
          email: 'alex.morgan@pulseboard.io',
          name: 'Alex Morgan',
          role: 'Product Lead',
          emailConfirmedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        })
      );
    });
  });

  test('should open user dropdown menu and log out successfully', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.getByTestId('dashboard-page')).toBeVisible();

    await page.getByTestId('user-menu-button').click();
    await expect(page.getByTestId('user-menu-dropdown')).toBeVisible();

    await page.getByTestId('logout-button').click();

    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByTestId('login-submit')).toBeVisible();

    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });
});
