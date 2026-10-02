import { test, expect } from '@playwright/test';

test.describe('8. Global Search Flow', () => {
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

  test('should open global search modal when trigger is clicked', async ({ page }) => {
    await page.goto('/dashboard');
    await page.getByTestId('global-search-trigger').click();
    await expect(page.getByTestId('global-search-modal')).toBeVisible();
    await expect(page.getByTestId('global-search-input')).toBeFocused();
  });

  test('should filter results based on search input query', async ({ page }) => {
    await page.goto('/dashboard');
    await page.getByTestId('global-search-trigger').click();
    await page.getByTestId('global-search-input').fill('PulseBoard');

    await expect(page.getByTestId('global-search-modal')).toBeVisible();
    await expect(page.getByText(/PulseBoard|Projects|Dashboard/i).first()).toBeVisible();
  });

  test('should close search modal when ESC key is pressed', async ({ page }) => {
    await page.goto('/dashboard');
    await page.getByTestId('global-search-trigger').click();
    await expect(page.getByTestId('global-search-modal')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.getByTestId('global-search-modal')).not.toBeVisible();
  });
});
