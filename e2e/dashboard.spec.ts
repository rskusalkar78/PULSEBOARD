import { test, expect } from '@playwright/test';

test.describe('3. Dashboard Flow', () => {
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

  test('should load dashboard with KPI cards and content', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.getByTestId('dashboard-page')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });

  test('should navigate to projects from dashboard quick navigation', async ({ page }) => {
    await page.goto('/dashboard');
    await page.getByTestId('nav-projects').click();
    await expect(page).toHaveURL(/\/projects/);
    await expect(page.getByTestId('projects-page')).toBeVisible();
  });
});
