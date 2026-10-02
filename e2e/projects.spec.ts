import { test, expect } from '@playwright/test';

test.describe('4. Project Creation Flow', () => {
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

  test('should display projects page and open project creation modal', async ({ page }) => {
    await page.goto('/projects');
    await expect(page.getByTestId('projects-page')).toBeVisible();
    await page.getByTestId('create-project-button').click();
    await expect(page.getByTestId('project-form')).toBeVisible();
  });

  test('should create a new project successfully', async ({ page }) => {
    await page.goto('/projects');
    const projectName = `Automated Project ${Date.now()}`;
    await page.getByTestId('create-project-button').click();

    await page.getByTestId('project-name-input').fill(projectName);
    await page.getByTestId('project-desc-input').fill('Project created via E2E test suite');
    await page.getByTestId('project-submit-button').click();

    await expect(page.getByTestId('project-form')).not.toBeVisible();
    await expect(page.getByText(projectName)).toBeVisible();
  });
});
