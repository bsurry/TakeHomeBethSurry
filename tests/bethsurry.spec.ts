import { test, expect } from '../fixtures/fixture';

test.beforeEach(async ({ page }) => {
  await page.goto('/todomvc/');
  await expect(page).toHaveTitle(/React • TodoMVC/);
});

//Note tests are pulling toDoPage page object from the fixture file (and in this case doesnt need { page } as it is already defined in the fixture)
test('should add a new todo', async ({ toDoPage }) => {
  await toDoPage.addNewToDo('Start Take Home assignment');
  await toDoPage.verifyToDoAdded('Start Take Home assignment');
  await toDoPage.verifyNumberOfToDos(1);
  await toDoPage.addNewToDo('Complete Playwright tests');
  await toDoPage.verifyToDoAdded('Complete Playwright tests');
  await toDoPage.verifyNumberOfToDos(2);
  await toDoPage.addNewToDo('Do API Tests');
  await toDoPage.verifyToDoAdded('Do API Tests');
  await toDoPage.verifyNumberOfToDos(3);
});

test('should mark todo as completed', async ({ toDoPage }) => {
  await toDoPage.addNewToDo('Complete Playwright tests');
  await toDoPage.verifyToDoAdded('Complete Playwright tests');
  await toDoPage.markToDoAsCompleted('Complete Playwright tests');
  await toDoPage.verifyToDoIsCompleted('Complete Playwright tests');
  await toDoPage.verifyNumberOfToDos(1);
});

//This test uses the toDoPageWithToDos fixture which has predefined ToDos
test('should delete a todo', async ({ toDoPageWithToDos }) => {
  await toDoPageWithToDos.verifyNumberOfToDos(3);
  await toDoPageWithToDos.deleteToDo('Predefined ToDo 1');
  await toDoPageWithToDos.verifyNumberOfToDos(2);
});

test('should filter todos', async ({ toDoPageWithToDos, filterPage }) => {
  await toDoPageWithToDos.verifyNumberOfToDos(3);
  await filterPage.selectActiveFilter();
  await toDoPageWithToDos.verifyNumberOfToDos(3);
  await filterPage.selectAllFilter();
  await toDoPageWithToDos.verifyNumberOfToDos(3);
  await toDoPageWithToDos.markToDoAsCompleted('Predefined ToDo 1');
  await toDoPageWithToDos.verifyToDoIsCompleted('Predefined ToDo 1');
  await toDoPageWithToDos.verifyNumberOfToDos(3);
  await filterPage.selectCompletedFilter();
  await toDoPageWithToDos.verifyNumberOfToDos(1);
  await filterPage.selectActiveFilter();
  await toDoPageWithToDos.verifyNumberOfToDos(2);
  await filterPage.selectAllFilter();
  await toDoPageWithToDos.verifyNumberOfToDos(3);
});

test('should clear completed todos', async ({ toDoPageWithToDos }) => {
  await toDoPageWithToDos.verifyNumberOfToDos(3);
  await toDoPageWithToDos.markToDoAsCompleted('Predefined ToDo 1');
  await toDoPageWithToDos.verifyToDoIsCompleted('Predefined ToDo 1');
  await toDoPageWithToDos.verifyNumberOfToDos(3);
  await toDoPageWithToDos.clearCompleted();
  await toDoPageWithToDos.verifyNumberOfToDos(2);
  await toDoPageWithToDos.markToDoAsCompleted('Predefined ToDo 2');
  await toDoPageWithToDos.verifyToDoIsCompleted('Predefined ToDo 2');
  await toDoPageWithToDos.markToDoAsCompleted('Predefined ToDo 3');
  await toDoPageWithToDos.verifyToDoIsCompleted('Predefined ToDo 3');
  await toDoPageWithToDos.clearCompleted();
  await toDoPageWithToDos.verifyNumberOfToDos(0);
});