import { test, expect } from '@playwright/test';

test.describe('10. Settings Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.setItem('pulseboard_auth_state', 'true');
    });
    await page.goto('/settings');
  });

  test('should display settings page and configuration options', async ({ page }) => {
    await expect(page.getByTestId('settings-page')).toBeVisible();
    await expect(page.getByRole('heading', { name: /System Settings/i })).toBeVisible();
    await expect(page.getByTestId('dark-mode-toggle')).toBeVisible();
    await expect(page.getByTestId('regenerate-api-key-btn')).toBeVisible();
  });

  test('should toggle preferences checkboxes', async ({ page }) => {
    const toggle = page.getByTestId('dark-mode-toggle');
    await expect(toggle).toBeChecked();
    await toggle.uncheck();
    await expect(toggle).not.toBeChecked();
  });
});
