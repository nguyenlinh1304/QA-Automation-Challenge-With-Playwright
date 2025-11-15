import dotenv from 'dotenv-flow';
import { mkdirSync, writeFileSync } from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';

// ======= Setup environment =======
dotenv.config({
    node_env: process.env.CI ? 'production' : process.env.NODE_ENV || 'test',
});

const BASE_URL = process.env.KIWI_BASE_URL!;
const AUTH = Buffer.from(
    `${process.env.KIWI_USERNAME}:${process.env.KIWI_API_TOKEN}`
).toString('base64');

// ======= Helper to resolve __dirname in ESM =======
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ======= Kiwi API helpers =======
async function kiwiGet(endpoint: string): Promise<any> {
    console.log(`Fetching kiwiGet ... ${endpoint}`);
    const res = await fetch(`${BASE_URL}/api/v2/${endpoint}`, {
        headers: { Authorization: `Basic ${AUTH}` },
    });
    if (!res.ok) throw new Error(`GET ${endpoint} failed: ${await res.text()}`);
    return res.json();
}

async function kiwiPost(endpoint: string, body: any): Promise<any> {
    console.log(`Fetching kiwiPost ... ${endpoint}`);
    const res = await fetch(`${BASE_URL}/api/v2/${endpoint}`, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${AUTH}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`POST ${endpoint} failed: ${await res.text()}`);
    return res.json();
}

// ======= Main execution =======
(async () => {
    try {
        // Create tmp folder if not exist
        const dirname = path.join(__dirname, '../../../..', 'tmp/kiwi');
        mkdirSync(dirname, { recursive: true });

        // Check if manual run ID is provided
        const manualRunId = process.env.KIWI_RUN_ID;

        if (manualRunId) {
            // Manual mode: Get test cases from existing run
            console.log('[pre-kiwi-run] Using existing Test Run:', manualRunId);

            // Get test run details
            const run = await kiwiGet(`testruns/${manualRunId}`);

            // Get test cases from the run
            const runCases = await kiwiGet(`testruns/${manualRunId}/cases`);
            const ids: number[] = runCases.results.map((c: any) => c.case);

            if (ids.length === 0) {
                throw new Error(`No test cases found in run ${manualRunId}`);
            }

            // Write files for later usage
            writeFileSync(path.join(dirname, 'grep-pattern.txt'), `\\[TC-(${ids.join('|')})\\]`);
            writeFileSync(path.join(dirname, 'run-id.txt'), `${manualRunId}`);

            console.log('[pre-kiwi-run] Successfully loaded Test Run:', manualRunId);
            console.log('[pre-kiwi-run] Test cases found:', ids.length);
        } else {
            // Auto mode: Create new run from test plan
            const planId = Number(process.env.KIWI_TEST_PLAN_ID);
            if (!planId) throw new Error("Either KIWI_RUN_ID or KIWI_TEST_PLAN_ID must be set");

            // Format today's date as DD/MM/YY
            const today = new Date().toLocaleString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit',
            });

            // Get plan info and test cases
            const plan = await kiwiGet(`testplans/${planId}`);
            const caseList = await kiwiGet(`testcases?plan=${planId}`);
            const ids: number[] = caseList.results.map((c: any) => c.id);

            // Create new test run
            const run = await kiwiPost('testruns', {
                title: `[Auto] ${today} | ${plan?.title} (PlanID: ${planId}, RunID: ${process.env.GITHUB_RUN_ID})`,
                plan: planId,
                manager: 2,
            });

            // Write files for later usage
            writeFileSync(path.join(dirname, 'grep-pattern.txt'), `\\[TC-(${ids.join('|')})\\]`);
            writeFileSync(path.join(dirname, 'run-id.txt'), `${run.id}`);

            console.log('[pre-kiwi-run] Successfully created Test Run:', run.id);
        }
    } catch (e) {
        console.error('[pre-kiwi-run] ERROR:', e);
        process.exit(1); // exit with error code
    }
})();

