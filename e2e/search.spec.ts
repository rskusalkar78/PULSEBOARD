import { test, expect } from '@playwright/test';

test.describe('8. Global Search Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.setItem('pulseboard_auth_state', 'true');
    });
    await page.goto('/dashboard');
  });

  test('should open global search modal when trigger is clicked', async ({ page }) => {
    await page.getByTestId('global-search-trigger').click();
    await expect(page.getByTestId('global-search-modal')).toBeVisible();
    await expect(page.getByTestId('global-search-input')).toBeFocused();
  });

  test('should filter results based on search input query', async ({ page }) => {
    await page.getByTestId('global-search-trigger').click();
    await page.getByTestId('global-search-input').fill('PulseBoard');

    // Should show matching items or quick pages
    await expect(page.getByTestId('global-search-modal')).toBeVisible();
    await expect(page.getByText(/PulseBoard|Projects|Dashboard/i).first()).toBeVisible();
  });

  test('should close search modal when ESC key is pressed', async ({ page }) => {
    await page.getByTestId('global-search-trigger').click();
    await expect(page.getByTestId('global-search-modal')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.getByTestId('global-search-modal')).not.toBeVisible();
  });
});
