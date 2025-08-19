import { test as base, Page } from '@playwright/test';
import { ToDoPage } from '../page-objects/todo';
import { ToDoFilters } from '../page-objects/filters';

// Define custom fixtures
type MyFixtures = {
    toDoPage: ToDoPage;
    toDoPageWithToDos: ToDoPage; // This Fixture will have predefined ToDos
    filterPage: ToDoFilters
    page: Page;
};

// Extend the base test with custom fixtures
export const test = base.extend<MyFixtures>({
    toDoPage: async ({ page }, use) => {
        const toDoPage = new ToDoPage(page);
        await use(toDoPage);
    },

    toDoPageWithToDos: async ({ page }, use) => {
        const toDoPage = new ToDoPage(page);
        // Pre-populate with some ToDos
        await toDoPage.addNewToDo('Predefined ToDo 1');
        await toDoPage.addNewToDo('Predefined ToDo 2');
        await toDoPage.addNewToDo('Predefined ToDo 3');
        await use(toDoPage);
    },

    filterPage: async ({ page }, use) => {
        const filterPage = new ToDoFilters(page);
        await use(filterPage);
    }
});

export const expect = test.expect;