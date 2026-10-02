import { test, expect } from '@playwright/test';

test.describe('9. Notifications Flow', () => {
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

  test('should display notification center page', async ({ page }) => {
    await page.goto('/notifications');
    await expect(page.getByTestId('notifications-page')).toBeVisible();
    await expect(page.getByRole('heading', { name: /Notification Center/i })).toBeVisible();
  });

  test('should simulate generating a new notification alert', async ({ page }) => {
    await page.goto('/notifications');
    await page.getByTestId('simulate-notification-btn').click();
    await expect(page.getByTestId('notification-item').first()).toBeVisible();
  });
});
