import dotenv from 'dotenv-flow';
import { QaseApi } from 'qaseio';
import fs, { readFileSync } from 'fs';
import path from 'path';
const OD = 'OD';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, '../../'),
  node_env: "test",
});

(async () => {
  try {
    const runIdPath = path.join(process.cwd(), 'main/scripts/tmp/qase/run-id.txt');
    const runId = Number(readFileSync(
      runIdPath.trim(),
    ).toString()) ?? 1;
    const resultPath = path.join(process.cwd(), '/result.json');
    const resultRaw = fs.readFileSync(resultPath, 'utf-8');
    const testResult = JSON.parse(resultRaw);
    const qase = new QaseApi({
      token: process.env.QASE_TESTOPS_API_TOKEN || '',
    });
    for (const suite of testResult?.suites) {
      const title = suite?.specs?.[0]?.title
      console.log('Title:', title);
      const tests = suite?.specs?.[0]?.tests

      for (const test of tests) {
        const case_id = Number(title.match(/\[(?:[^\d]*)(\d+)\]/)?.[1]);
        const result = test?.results?.[0];
        const status = result?.status ?? "failed";

        // Build comment with stack trace
        let comment = '';

        if (status === 'failed' && result?.error?.stack) {
          // Clean ANSI codes from stack trace
          const cleanStack = result.error.stack.replace(/\u001b\[[0-9;]*m/g, '');
          comment = cleanStack;
        }

        console.log('Test:', test?.results);
        await qase.results.createResult(OD, runId, {
          case_id,
          status,
          comment: comment || 'Test completed',
        });
        console.log(`[post-qase-run] Posted result for case ${case_id}: ${status}`);
      }
    }

    await qase.runs.completeRun(OD, runId);
    console.log('[post-qase-run] Successfully completed test run:', runId);
  } catch (e) {
    console.error('[post-qase-run] Failure message:', e);
  }
})();
