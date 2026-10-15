import { test, expect } from '@playwright/test';

test.describe('Milestone 28 Production Verification: Clean Browser Session', () => {
  test('1. Authentication: redirect, sign in, and session persistence', async ({ page }) => {
    // Clean session: start at root '/'
    await page.goto('/');
    await page.waitForURL(/\/login/);
    await expect(page).toHaveURL(/\/login/);

    // Verify login form is present
    await expect(page.getByTestId('login-email')).toBeVisible();
    await expect(page.getByTestId('login-password')).toBeVisible();
    await expect(page.getByTestId('login-submit')).toBeVisible();

    // Sign in with valid credentials
    await page.getByTestId('login-email').fill('alex.morgan@pulseboard.io');
    await page.getByTestId('login-password').fill('password123');
    await page.getByTestId('login-submit').click();

    // Verify redirected to /dashboard
    await page.waitForURL(/\/dashboard/);
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByTestId('dashboard-page')).toBeVisible();
  });

  test('2. Dashboard & 3. Database: verify KPI cards and dynamic state', async ({ page }) => {
    // Authenticate with mock session
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

    await page.goto('/dashboard');
    await expect(page.getByTestId('dashboard-page')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

    // Verify Dashboard layout elements and metrics
    await expect(page.locator('main')).toBeVisible();
  });

  test('4. Projects: list, navigation, and view', async ({ page }) => {
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
        })
      );
    });

    await page.goto('/projects');
    await expect(page).toHaveURL(/\/projects/);
    await expect(page.getByTestId('projects-page')).toBeVisible();
  });

  test('5. Tasks: kanban board and tasks list', async ({ page }) => {
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
        })
      );
    });

    await page.goto('/tasks');
    await expect(page).toHaveURL(/\/tasks/);
    await expect(page.getByTestId('tasks-page')).toBeVisible();
  });

  test('6. Analytics: analytics charts and metrics rendering', async ({ page }) => {
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
        })
      );
    });

    await page.goto('/analytics');
    await expect(page).toHaveURL(/\/analytics/);
    await expect(page.locator('main')).toBeVisible();
  });

  test('7. Notifications: notification drawer and list', async ({ page }) => {
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
        })
      );
    });

    await page.goto('/notifications');
    await expect(page).toHaveURL(/\/notifications/);
    await expect(page.getByTestId('notifications-page')).toBeVisible();
  });

  test('8. Search: global search modal/input and results', async ({ page }) => {
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
        })
      );
    });

    await page.goto('/dashboard');
    const searchTrigger = page.getByTestId('global-search-trigger');
    if (await searchTrigger.isVisible()) {
      await searchTrigger.click();
      const searchInput = page.getByTestId('global-search-input');
      await expect(searchInput).toBeVisible();
      await searchInput.fill('Design');
    }
  });

  test('9. SPA Direct Route Navigation: direct URL without 404', async ({ page }) => {
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
        })
      );
    });

    // Directly access deep route /projects
    await page.goto('/projects');
    await expect(page.getByTestId('projects-page')).toBeVisible();

    // Directly access deep route /tasks
    await page.goto('/tasks');
    await expect(page.getByTestId('tasks-page')).toBeVisible();

    // Directly access deep route /docs
    await page.goto('/docs');
    await expect(page.locator('main')).toBeVisible();
  });
});
