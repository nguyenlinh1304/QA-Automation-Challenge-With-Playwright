import dotenv from 'dotenv-flow';
import { readFileSync } from 'fs';
import { defineConfig, devices } from '@playwright/test';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const mainDir = path.resolve(__dirname, 'main');

dotenv.config({
    node_env: process.env.NODE_ENV || (process.env.CI ? 'production' : 'test'),
    path: mainDir,
});

export default defineConfig({
    fullyParallel: true,
    retries: process.env.CI ? 1 : 0,
    testMatch: ['**/*.e2e.ts'],
    testDir: path.join(mainDir, 'tests/e2e'),
    outputDir: path.join(mainDir, 'result/test-results'),
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

