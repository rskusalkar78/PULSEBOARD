import { test, expect } from '@playwright/test';

test.describe('9. Notifications Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.setItem('pulseboard_auth_state', 'true');
    });
    await page.goto('/notifications');
  });

  test('should display notification center page', async ({ page }) => {
    await expect(page.getByTestId('notifications-page')).toBeVisible();
    await expect(page.getByRole('heading', { name: /Notification Center/i })).toBeVisible();
  });

  test('should simulate generating a new notification alert', async ({ page }) => {
    await page.getByTestId('simulate-notification-btn').click();
    await expect(page.getByTestId('notification-item').first()).toBeVisible();
  });
});
