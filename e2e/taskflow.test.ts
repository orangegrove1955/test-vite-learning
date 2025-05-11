import { test, expect } from "@playwright/test";

test.describe("Task Tracker E2E", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173"); // Update if running on a different port
  });

  test("User can add a task", async ({ page }) => {
    const newTaskText = "E2E Test Task";

    // Add a task
    await page.getByPlaceholder("Add a task").fill(newTaskText);
    await page.getByRole("button", { name: "Add" }).click();

    // Confirm it appears
    await expect(page.getByText(newTaskText)).toBeVisible();
  });

  test("User can toggle a task", async ({ page }) => {
    const toggleTaskText = "Preloaded task";

    const taskSpan = await page.getByText(toggleTaskText);
    await expect(taskSpan).not.toHaveCSS("text-decoration", /line-through/);

    const toggleButton = await page.getByRole("checkbox", {
      name: toggleTaskText,
    });

    await toggleButton.click();
    await expect(taskSpan).toHaveCSS("text-decoration", /line-through/);
  });

  test("User can delete a task", async ({ page }) => {
    const deleteTaskText = "Preloaded task";

    const deleteButton = await page
      .getByRole("listitem")
      .filter({ hasText: deleteTaskText })
      .getByRole("button");

    console.log(deleteButton);
    await deleteButton.click();

    // Confirm it appears
    await expect(page.locator(`text=${deleteTaskText}`)).toHaveCount(0);
  });

  test("user can add, toggle, and delete a task", async ({ page }) => {
    const newTaskText = "E2E Test Task";

    // Add a task
    await page.getByPlaceholder("Add a task").fill(newTaskText);
    await page.getByRole("button", { name: "Add" }).click();

    // Confirm it appears
    await expect(page.getByText(newTaskText)).toBeVisible();

    // Verify toggle by checking for line-through style
    const taskSpan = await page.getByText(newTaskText);
    await expect(taskSpan).not.toHaveCSS("text-decoration", /line-through/);

    // Toggle the task
    await page.getByRole("checkbox", { name: newTaskText }).click();
    await expect(taskSpan).toHaveCSS("text-decoration", /line-through/);

    // Delete the task
    const deleteButton = await page
      .getByRole("listitem")
      .filter({ hasText: newTaskText })
      .getByRole("button");

    await deleteButton.click();

    // Confirm it disappears
    await expect(page.locator(`text=${newTaskText}`)).toHaveCount(0);
  });
});
