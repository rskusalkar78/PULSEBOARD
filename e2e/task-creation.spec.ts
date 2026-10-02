import { test, expect } from '@playwright/test';

test.describe('5. Task Creation Flow', () => {
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

  test('should open task creation modal and create a new task', async ({ page }) => {
    await page.goto('/tasks');
    await expect(page.getByTestId('tasks-page')).toBeVisible();
    await page.getByTestId('new-task-button').click();

    const taskTitle = `E2E New Task ${Date.now()}`;
    await page.getByTestId('task-title-input').fill(taskTitle);
    await page
      .getByTestId('task-desc-input')
      .fill('Task description generated during E2E testing.');

    const projectSelect = page.getByTestId('task-project-select');
    if (await projectSelect.isVisible()) {
      const options = await projectSelect.locator('option').allInnerTexts();
      if (options.length > 1) {
        await projectSelect.selectOption({ index: 1 });
      }
    }

    await page.getByTestId('task-submit-button').click();

    await expect(page.getByTestId('task-title-input')).not.toBeVisible();
    await expect(page.getByText(taskTitle)).toBeVisible();
  });
});
