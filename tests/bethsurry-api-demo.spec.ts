import { pwApi } from 'pw-api-plugin';
import { expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { test } from '../apiTest.config'; //also based on pw-api-plugin

test.describe('demp API app tests happy paths @user @happypath', () => {

    test('should return 200 on GET list', async ({ request, page, baseApiUrl, appId }) => {        
        const responseGet = await pwApi.get({ request, page }, `${baseApiUrl}/user`, {
            headers: {
                'app-id': appId
            }
        });
        expect(responseGet.status()).toBe(200);
        const responseBody = await responseGet.json();
    });

    test('should create a new user with POST, get and then delete it - happy path', async ({ request, page, baseApiUrl, appId  }) => {
        const randomEmail = `bethtest${faker.string.alphanumeric(20)}@example.com`;
        let userId = '';
        await test.step('Create a new user', async () => {
            const responsePost = await pwApi.post({ request, page }, `${baseApiUrl}/user/create`, 
                {
                    data: {
                        firstName: "Tester",
                        lastName: "Test",
                        email: randomEmail
                    },
                    headers: {
                        'app-id': appId
                    },
                }
            );
            expect(responsePost.status()).toBe(200)
            const responseBody = await responsePost.json();
            expect(responseBody.firstName).toBe('Tester');
            expect(responseBody.lastName).toBe('Test');
            expect(responseBody.email).toBe(randomEmail.toLowerCase());
            userId = responseBody.id;
        });
        await test.step('Get the user, verify response', async () => {
            const responseGet = await pwApi.get({ request, page }, `${baseApiUrl}/user/${userId}`, {
                headers: {
                    'app-id': appId
                }
            });
            expect(responseGet.status()).toBe(200);
            const userResponseBody = await responseGet.json();
            expect(userResponseBody.firstName).toBe('Tester');
            expect(userResponseBody.lastName).toBe('Test');
            expect(userResponseBody.email).toBe(randomEmail.toLowerCase());
        });
        await test.step('Delete the user, verify it is gone', async () => {
            const responseDelete = await pwApi.delete({ request, page }, `${baseApiUrl}/user/${userId}`, {
                headers: {
                    'app-id': appId
                }       
            });
            expect(responseDelete.status()).toBe(200);

            const responseGetAfterDelete = await pwApi.get({ request, page }, `${baseApiUrl}/user/${userId}`, {
                headers: {
                    'app-id': appId
                }   
            });
            expect(responseGetAfterDelete.status()).toBe(404);
        });
        //I would include authentication tests here, but I cannot find any documentation about an endpoint like: POST /login on this API.
    })
});

test.describe('demo API app tests error paths @user @errorpath', () => {
    /*
    x APP_ID_NOT_EXIST
    app-id header is found but the value is not valid.
    x APP_ID_MISSING
    app-id header is not set correctly. Note that you need to set app-id header for each request. Getting Started page for more info.
    x PARAMS_NOT_VALID
    URL params (ex: /user/{id} - {id} is URL param) is not valid. This error returned in both cases: param format is invalid, param is not found.
    x BODY_NOT_VALID
    Applicable only for not GET requests like POST, PUT or DELETE. Boyd format is invalid, or even some keys are not valid.
    x RESOURCE_NOT_FOUND
    Applicable for all requests that has {id} URL param. Mean that item that was requested(for get, update, delete) is not found. Works correctly if you try to create a post for user that not exist or deleted.
    x PATH_NOT_FOUND
    Request path is not valid, check controller documentation to validate the URL.
    not tested - SERVER_ERROR
    */

    test('app id not exist error', async ({ request, page, baseApiUrl, appId  }) => {        
        const responseGet = await pwApi.get({ request, page }, `${baseApiUrl}/user`, {
            headers: {
                'app-id': 'invalid-app-id'
            }
        });
        expect(responseGet.status()).toBe(403);
        const responseBody = await responseGet.json();
        expect(responseBody.error).toBe('APP_ID_NOT_EXIST');
    });

    test('app id missing error', async ({ request, page, baseApiUrl, appId  }) => {
        const responseGet = await pwApi.get({ request, page }, `${baseApiUrl}/user`);
        expect(responseGet.status()).toBe(403);
        const responseBody = await responseGet.json();
        expect(responseBody.error).toBe('APP_ID_MISSING');
    });

    test('params not valid error', async ({ request, page, baseApiUrl, appId  }) => {
        const responseGet = await pwApi.get({ request, page }, `${baseApiUrl}/user/invalid-id`, {
            headers: {
                'app-id': appId
            }
        });
        expect(responseGet.status()).toBe(400);
        const responseBody = await responseGet.json();
        expect(responseBody.error).toBe('PARAMS_NOT_VALID');
    });

    test('body not valid error', async ({ request, page, baseApiUrl, appId  }) => {
        const responsePost = await pwApi.post({ request, page }, `${baseApiUrl}/user/create`, 
            {
                data: {
                    firstName: 2,
                },
                headers: {
                    'app-id': appId
                },
            }
        );
        expect(responsePost.status()).toBe(400)
        const responseBody = await responsePost.json();
        expect(responseBody.error).toBe('BODY_NOT_VALID');  
    });

    test('resource not found error', async ({ request, page, baseApiUrl, appId  }) => {
        const responseDelete = await pwApi.delete({ request, page }, `${baseApiUrl}/user/1234567890abcdef12345678`, {
            headers: {
                'app-id': appId
            }       
        });
        expect(responseDelete.status()).toBe(404);
        const responseBody = await responseDelete.json();
        expect(responseBody.error).toBe('RESOURCE_NOT_FOUND');      
    });

    test('path not found error', async ({ request, page, baseApiUrl, appId  }) => {
        const responseGet = await pwApi.get({ request, page }, `${baseApiUrl}/invalid-path`, {
            headers: {
                'app-id': appId
            }
        });
        expect(responseGet.status()).toBe(404);
        const responseBody = await responseGet.json();
        expect(responseBody.error).toBe('PATH_NOT_FOUND');
    });

});