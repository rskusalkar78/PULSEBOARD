import { test, expect } from '@playwright/test';

test.describe('6. Task Completion Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.setItem('pulseboard_auth_state', 'true');
    });
    await page.goto('/tasks');
  });

  test('should create a task with Completed status', async ({ page }) => {
    const taskTitle = `Completed Task ${Date.now()}`;
    await page.getByTestId('new-task-button').click();

    await page.getByTestId('task-title-input').fill(taskTitle);
    await page.getByTestId('task-desc-input').fill('Testing task completion.');

    // Select project if needed
    const projectSelect = page.getByTestId('task-project-select');
    if (await projectSelect.isVisible()) {
      const options = await projectSelect.locator('option').allInnerTexts();
      if (options.length > 1) {
        await projectSelect.selectOption({ index: 1 });
      }
    }

    // Set status to completed
    await page.getByTestId('task-status-select').selectOption('completed');
    await page.getByTestId('task-submit-button').click();

    // Verify task appears under completed column or with completed status
    await expect(page.getByText(taskTitle)).toBeVisible();
    await expect(page.getByTestId('kanban-column-completed')).toContainText(taskTitle);
  });
});
