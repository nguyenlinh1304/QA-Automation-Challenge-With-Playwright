import dotenv from 'dotenv-flow';
import { readFileSync } from 'fs';
import path from 'path';
import fetch from 'node-fetch';

dotenv.config({
    node_env: process.env.CI ? 'production' : process.env.NODE_ENV || 'test',
});

const BASE_URL = process.env.KIWI_BASE_URL;
const AUTH = Buffer.from(`${process.env.KIWI_USERNAME}:${process.env.KIWI_PASSWORD || ''}`).toString('base64');

async function kiwiPatch(endpoint: string, body: any) {
    const res = await fetch(`${BASE_URL}/api/v2/${endpoint}`, {
        method: 'PATCH',
        headers: {
            Authorization: `Basic ${AUTH}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

(async () => {
    try {
        const dirname = path.join(__dirname, '../../../..', 'tmp/kiwi');
        const runId = readFileSync(path.join(dirname, 'run-id.txt'), 'utf-8').trim();
        await kiwiPatch(`testruns/${runId}`, {
            status: 'completed'
        });

        console.log('[post-kiwi-run] Successfully completed Test Run with id:', runId);
    } catch (e) {
        console.log('[post-kiwi-run] Failure message:', e);
    }
})();
