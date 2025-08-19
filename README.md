# Take Home Assignment

## About the Submission

### Installation

`npm install` to install playwright and all other required packages

### How to Run

- `npx playwright test` - runs all tests
- `npx playwright test --grep @user` - run all the user api tests
- `npx playwright test --grep @happypath` - run all the happy path api tests
- `npx playwright test --grep @errorpath` - run all the error path api tests
- `npx playwright test --repeat-each=2` - to run each test twice
- `npx playwright test --debug` - run in debug mode (all previous are headless)
- `npx playwright test --ui` - run in ui mode

### About the API Submission

I have completed all of the assignment except there is no documented `POST /login` endpoint in the API provided so that is not done

`pw-api-plugin` - I am using the `pw-api-plugin` which I recently discovered. I mainly like it for the ability to make the trace file more useful for debugging when doing API testing.

`apiTest.config.ts` - I created a custom config for the api tests that defines and pulls in from `.env` both the `BASE_URL_API` and `APP_ID` this config can be found in `apiTest.config.ts`. It is extending from the `pw-api-plugin`. Then when I pass these items into the api tests, I get them available whenever I need. After the fact I considered whether I should have just used playwright project config for this but I think this works well for now and the scope of this small project.

I created an `apiTests` project in the playwright config to only run these 1x (as opposed to the UI tests that run on 3 browsers). In real life I would filter these tests with a testing folder but in this project there are only 2 test files so I filtered on the exact test name

These tests are examples of API tests. For each of the error cases it should really be done for each applicable endpoint with maybe additional cases, but in this short scoped project I just did one of each error case.

I did tagging on these tests - distinguishing `@happypath` from `@errorpath`. All of these tests are also tagged with `@user`

### About the FE Submission

I created 2 page objects: `todo.ts` and `filters.ts`. These could really be combined but just wanted to illustrate breaking the page object functions into logical groups

I am also using a fixture file to make sure the page objects can be created outside of the tests and just passed in, there is also a special fixture in there: `toDoPageWithToDos` that includes the logic to add 3 todos for the start of a test so the test doesnt have to show that logic

I have left the default retry logic for CI only: `retries: process.env.CI ? 2 : 0,`

I would NOT normally include the playwright report in a github repository but I have done it for this example (temp removed `playwright-report` from the git ignore to load one up)
- You will have to load the report locally via: `npx playwright show-report /YOURLOCALPATH/TakeHomeBethSurry/playwright-report`
- this makes the repo looks like its mostly HTML and not typescript (oops), but I thought folks might like to see the report with the `pw-api-plugin`

I initially had difficulty creating the app-id bc I really had to fight with the site to log in with either google or gihub (I think its mostly broken), it would just bail out of the login. I eventually succeeded when I told Playwright MCP to try to get the token for me and it succeeded. I actually wonder if that was just a function of being in an incognito browser. Note: this was the ONLY use of the MCP in this project. I did not use it in any wayt for generating tests - just trying to get the app id when it was fighting with me

## Additional Deliverables

## sample .env file

```
APP_ID=YOURAPPIDHERE
BASE_URL=https://demo.playwright.dev
BASE_URL_API=https://dummyapi.io/data/v1
```

## Answering Questions
- How would you handle test data setup and cleanup? 
  - I like using fixtures for this, you can see an example of the `toDoPageWithToDos` though in a real example maybe there would be a better way to populate those todos (api?)
- How would you organize tests for multiple environments?
  - .env files
- What changes would you make if tests needed to run in CI/CD pipelines?
  - I would create custom scripts that include the env file required so we can run the right env command in CI
  - I would record trace file on for only retries (saves resources)
  - I would probably make the retries be only 1 (current default is 2). I havent found a lot of need to retry 2x
  - We will also need a way to save the secret `APP_ID` somewhere in CI - in pipeline secrets itself or some other secret store. Note I have not done this so the API tests fail in the pipeline in my repo.
- How would you isolate flaky tests or diagnose failures? 
  - Using a dashboard watch for tests that fail inconsistantly
  - gather up example trace files of both passed and failed
  - dig in and see what you find
  - helps if you can line the timing up of failures with other observability tools like Datadog
- What tools would you integrate for reporting, alerts, or observability?
  - In my previous role I had a lot of success with a test dash in datadog. The really nice this is to be able to line up test runs with other observable things in DD, allowing us to get a full context of the system under test at the time of the failure
  - From CI I would include some kind of slack alerts. If our test suite is very solid I would send it to a general broadcast channel. If we are just setting up and learning about it I would sent it to a test team internal channel to observe until its ready for prime time.
  - I have also use allure reports in the past and they are nice out of the box, but I liked our custom datadog dash better

## Specifications (for reference)
Part 1: Backend Automation 
Use the following API specification: https://dummyapi.io/docs 
Endpoints 
- POST /users – Create a new user 
- GET /users/{id} – Fetch user details 
- DELETE /users/{id} – Delete a user 
- POST /login – Authenticate user and get token
Requirements 
Automate tests covering: 
- Valid inputs (happy path) 
- Invalid inputs and error codes 
- Authenticated vs. unauthenticated access 
- Duplicate data handling 
- Implement configuration for base URL, credentials, and environment 
- Add reporting for test results 

Part 2: Frontend Automation 
Use this sample Todo app: https://demo.playwright.dev/todomvc/ Requirements 
Automate user flows: 
- Add a new todo 
- Mark it as complete 
- Delete the todo 
 - Use resilient locators (test IDs or accessibility selectors) 
 - Use an abstraction pattern (e.g., Page Object Model) 
 - Support execution in both headless and headed modes 
 - Provide a test configuration system 
Bonus points 
- Tagging or filtering option to run subset of tests 
- Retry mechanism for flaky scenarios 

## Deliverables 
Please submit the following: 
- Test categories and test scenarios considered for the exercise 
- Source code for backend and frontend test automation
- README.md with: 
  - Setup and installation instructions 
  - Commands to run the tests 
  - Any design decisions or assumptions made 
  - Sample .env or config file (without credentials)
- Optional: 
  - GitHub repository link 
  - Test reports or screenshots (if applicable) 

Questions to Consider 
While working on the challenge, keep these questions in mind and feel free to mention them in the README if relevant: 
- How would you handle test data setup and cleanup? 
- How would you organize tests for multiple environments? 
- What changes would you make if tests needed to run in CI/CD pipelines?
- How would you isolate flaky tests or diagnose failures? 
- What tools would you integrate for reporting, alerts, or observability?
