import { test, expect } from '@playwright/test';

test.describe('3. Dashboard Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.setItem('pulseboard_auth_state', 'true');
    });
    await page.goto('/dashboard');
  });

  test('should load dashboard with KPI cards and content', async ({ page }) => {
    await expect(page.getByTestId('dashboard-page')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });

  test('should navigate to projects from dashboard quick navigation', async ({ page }) => {
    await page.getByTestId('nav-projects').click();
    await expect(page).toHaveURL(/\/projects/);
    await expect(page.getByTestId('projects-page')).toBeVisible();
  });
});
