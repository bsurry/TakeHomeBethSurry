import { test as base } from 'pw-api-plugin'; // Importing the base test from the Playwright API plugin so I still get its benefits

 import dotenv from 'dotenv';
 import path from 'path';
 dotenv.config({ path: path.resolve(__dirname, '.env'), quiet: true });

export type TestOptions = {
  baseApiUrl: string;
  appId: string;
};

export const test = base.extend<TestOptions>({
    baseApiUrl: process.env.BASE_URL_API || 'https://dummyapi.io/data/v1',
    appId: process.env.APPID || 'no-app-id-set',
});