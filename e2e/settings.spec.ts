import { test, expect } from '@playwright/test';

test.describe('10. Settings Flow', () => {
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

  test('should display settings page and configuration options', async ({ page }) => {
    await page.goto('/settings');
    await expect(page.getByTestId('settings-page')).toBeVisible();
    await expect(page.getByRole('heading', { name: /System Settings/i })).toBeVisible();
    await expect(page.getByTestId('dark-mode-toggle')).toBeVisible();
    await expect(page.getByTestId('regenerate-api-key-btn')).toBeVisible();
  });

  test('should toggle preferences checkboxes', async ({ page }) => {
    await page.goto('/settings');
    const toggle = page.getByTestId('dark-mode-toggle');
    await expect(toggle).toBeChecked();
    await toggle.uncheck();
    await expect(toggle).not.toBeChecked();
  });
});
