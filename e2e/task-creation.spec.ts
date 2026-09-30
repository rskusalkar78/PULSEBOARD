import { test, expect } from '@playwright/test';

test.describe('5. Task Creation Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.setItem('pulseboard_auth_state', 'true');
    });
    await page.goto('/tasks');
  });

  test('should open task creation modal and create a new task', async ({ page }) => {
    await expect(page.getByTestId('tasks-page')).toBeVisible();
    await page.getByTestId('new-task-button').click();

    const taskTitle = `E2E New Task ${Date.now()}`;
    await page.getByTestId('task-title-input').fill(taskTitle);
    await page
      .getByTestId('task-desc-input')
      .fill('Task description generated during E2E testing.');

    // Select project if dropdown exists and has options
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
