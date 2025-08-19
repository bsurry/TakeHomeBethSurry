import { Page, Locator, expect } from '@playwright/test';

export class ToDoPage {
    readonly page: Page;
    readonly enterToDoText: Locator;
    readonly todoItem: Locator;
    readonly lastAddedTodoItem: Locator;
    readonly deleteTodoButton: Locator;
    readonly todoItemToggle: Locator;
    readonly clearCompletedButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.enterToDoText = page.getByRole('textbox', { name: 'What needs to be done?' }).describe('Enter ToDo Text Box'); // trying out new feature in version 1.53
        this.todoItem = page.getByTestId('todo-item').describe('ToDo Item');
        this.lastAddedTodoItem = this.todoItem.last().describe('Last Added ToDo Item');
        this.deleteTodoButton = this.todoItem.getByRole('button', { name: 'Delete' }).describe('Delete ToDo Button');
        this.todoItemToggle = page.getByLabel('Toggle Todo').describe('ToDo Item Toggle');
        this.clearCompletedButton = page.getByRole('button', { name: 'Clear completed' }).describe('Clear Completed Button');
    }

    async addNewToDo(toDoText: string) {
        await this.enterToDoText.fill(toDoText);
        await this.enterToDoText.press('Enter');
    }
    async verifyToDoAdded(toDoText: string) {
        await expect(this.lastAddedTodoItem).toContainText(toDoText);
    }

    async markToDoAsCompleted(toDoText: string) {
        await expect(this.todoItem.filter({ hasText: toDoText })).not.toHaveClass(/completed/);
        await this.todoItem.filter({ hasText: toDoText }).getByLabel('Toggle Todo').click();
    }

    async verifyToDoIsCompleted(toDoText: string) {
        await expect(this.todoItem.filter({ hasText: toDoText })).toHaveClass(/completed/);
    }

    async deleteToDo(toDoText: string) {
        await expect(this.todoItem.filter({ hasText: toDoText })).toBeVisible();
        await expect(this.todoItem.filter({ hasText: toDoText })).toBeVisible();
        await this.todoItem.filter({ hasText: toDoText }).hover();
        await this.todoItem.filter({ hasText: toDoText }).getByRole('button', { name: 'Delete'}).click();
        await expect(this.todoItem.filter({ hasText: toDoText })).not.toBeVisible()
    }

    async verifyNumberOfToDos(expectedCount: number) {
        await expect(this.page.getByTestId('todo-item')).toHaveCount(expectedCount);
    }

    async clearCompleted() {
        await this.clearCompletedButton.click();
    }

}