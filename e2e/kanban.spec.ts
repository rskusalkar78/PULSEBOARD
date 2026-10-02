import { test, expect } from '@playwright/test';

test.describe('7. Kanban Drag and Drop Flow', () => {
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

  test('should render all kanban columns', async ({ page }) => {
    await page.goto('/tasks');
    await expect(page.getByTestId('kanban-column-backlog')).toBeVisible();
    await expect(page.getByTestId('kanban-column-todo')).toBeVisible();
    await expect(page.getByTestId('kanban-column-in_progress')).toBeVisible();
    await expect(page.getByTestId('kanban-column-in_review')).toBeVisible();
    await expect(page.getByTestId('kanban-column-completed')).toBeVisible();
  });

  test('should toggle between Kanban and List views', async ({ page }) => {
    await page.goto('/tasks');
    await page.getByTestId('list-view-btn').click();
    await expect(page.getByRole('table')).toBeVisible();

    await page.getByTestId('kanban-view-btn').click();
    await expect(page.getByTestId('kanban-column-todo')).toBeVisible();
  });

  test('should support moving a task from Todo to In Progress', async ({ page }) => {
    await page.goto('/tasks');
    const taskTitle = `Kanban Move Task ${Date.now()}`;
    await page.getByTestId('new-task-button').click();
    await page.getByTestId('task-title-input').fill(taskTitle);
    await page.getByTestId('task-status-select').selectOption('todo');

    const projectSelect = page.getByTestId('task-project-select');
    if (await projectSelect.isVisible()) {
      const options = await projectSelect.locator('option').allInnerTexts();
      if (options.length > 1) {
        await projectSelect.selectOption({ index: 1 });
      }
    }

    await page.getByTestId('task-submit-button').click();

    const todoCol = page.getByTestId('kanban-column-todo');
    await expect(todoCol).toContainText(taskTitle);

    const card = page.getByText(taskTitle);
    const targetCol = page.getByTestId('kanban-column-in_progress');

    await card.dragTo(targetCol);

    await expect(page.getByTestId('kanban-column-in_progress')).toContainText(taskTitle);
  });
});
