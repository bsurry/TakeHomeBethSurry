import { Page, Locator, expect } from '@playwright/test';

export class ToDoFilters {
    readonly page: Page;
    readonly enterToDoText: Locator;
    readonly activeFilterButton: Locator;
    readonly completedFilterButton: Locator;
    readonly allFilterButton: Locator;


    constructor(page: Page) {
        this.page = page;
        this.enterToDoText = page.getByRole('textbox', { name: 'What needs to be done?' }).describe('Enter ToDo Text Box'); // trying out new feature in version 1.53
        this.activeFilterButton = page.getByRole('link', { name: 'Active' }).describe('Active Filter Button');
        this.completedFilterButton = page.getByRole('link', { name: 'Completed' }).describe('Completed Filter Button');
        this.allFilterButton = page.getByRole('link', { name: 'All' }).describe('All Filter Button');
    }

    async selectActiveFilter() {
        await this.activeFilterButton.click();
    }

    async selectCompletedFilter() {
        await this.completedFilterButton.click();
    }

    async selectAllFilter() {
        await this.allFilterButton.click();
    }

}