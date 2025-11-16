import dotenv from 'dotenv-flow';
import { readFileSync } from 'fs';
import { defineConfig, devices } from '@playwright/test';
import path from 'path';

dotenv.config({
    node_env: process.env.NODE_ENV || (process.env.CI ? 'production' : 'test'),
});


export default defineConfig({
    fullyParallel: true,
    retries: process.env.CI ? 1 : 0,
    testMatch: ['**/*.e2e.ts'],
    testDir: './tests/e2e',
    outputDir: './result/test-results',
    use: {
        baseURL: process.env.BASE_URL || 'http://localhost',
        headless: true,
        video: 'on',
        trace: 'on',
        screenshot: 'on',
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },
        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
        },
    ],
});
