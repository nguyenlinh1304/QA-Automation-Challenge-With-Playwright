import dotenv from 'dotenv-flow';
import { readFileSync } from 'fs';
import { defineConfig, devices } from '@playwright/test';
import path from 'path';

dotenv.config({
    node_env: process.env.CI ? 'production' : process.env.NODE_ENV || 'test',
});

let grep: RegExp | undefined = undefined;

if (process.env.CI && process.env.KIWI_MODE === 'tcms') {
    try {
        const dirname = path.join(__dirname, 'tmp/kiwi');
        process.env.KIWI_RUN_ID = readFileSync(path.join(dirname, 'run-id.txt'), 'utf-8').trim();
        grep = new RegExp(readFileSync(path.join(dirname, 'grep-pattern.txt'), 'utf-8').trim());
    } catch (e) {
        console.log('[playwright.config.ts]: Failed to generate grep pattern. Details:', e);
    }
}

export default defineConfig({
    grep,
    fullyParallel: true,
    retries: process.env.CI ? 1 : 0,
    testMatch: ['**/*.e2e.ts'],
    testDir: './tests/e2e',
    outputDir: './result/test-results',
    reporter: (() => {
        if (process.env.CI) {
            const reporters: Array<[string, any]> = [
                ['blob', { outputDir: './tests/playwright/blob-reports' }],
            ];
            if (process.env.KIWI_MODE === 'tcms') {
                reporters.push([
                    'playwright-kiwi-reporter',
                    {
                        tms: {
                            project: 'OrangeHRM',
                        },
                        environment: process.env.NEXT_PUBLIC_STAGE,
                    },
                ]);
            }
            return reporters;
        }
        return [
            ['list'],
            ['html', { outputFolder: './tests/playwright/test-reports' }],
        ];
    })(),
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
