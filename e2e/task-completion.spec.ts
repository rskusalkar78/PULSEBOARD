import { test, expect } from '@playwright/test';

test.describe('6. Task Completion Flow', () => {
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

  test('should create a task with Completed status', async ({ page }) => {
    await page.goto('/tasks');
    const taskTitle = `Completed Task ${Date.now()}`;
    await page.getByTestId('new-task-button').click();

    await page.getByTestId('task-title-input').fill(taskTitle);
    await page.getByTestId('task-desc-input').fill('Testing task completion.');

    const projectSelect = page.getByTestId('task-project-select');
    if (await projectSelect.isVisible()) {
      const options = await projectSelect.locator('option').allInnerTexts();
      if (options.length > 1) {
        await projectSelect.selectOption({ index: 1 });
      }
    }

    await page.getByTestId('task-status-select').selectOption('completed');
    await page.getByTestId('task-submit-button').click();

    await expect(page.getByText(taskTitle)).toBeVisible();
    await expect(page.getByTestId('kanban-column-completed')).toContainText(taskTitle);
  });
});
