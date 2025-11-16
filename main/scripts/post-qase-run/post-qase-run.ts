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
    const title = testResult?.suites?.[0]?.specs?.[0]?.title
    const tests = testResult?.suites?.[0]?.specs?.[0]?.tests

    const qase = new QaseApi({
      token: process.env.QASE_TESTOPS_API_TOKEN || '',
    });

    for (const test of tests) {
      const case_id = Number(title.match(/\[(?:[^\d]*)(\d+)\]/)?.[1]);

      await qase.results.createResult(OD, runId, {
        case_id,
        status: test?.results?.[0]?.status ?? "failed",
        comment: test?.results?.[0]?.errors?.join('\n') || '',
      });
      console.log(`[post-qase-run] Posted result for case ${case_id}: ${test.status}`);
    }

    await qase.runs.completeRun(OD, runId);
    console.log('[post-qase-run] Successfully completed test run:', runId);
  } catch (e) {
    console.error('[post-qase-run] Failure message:', e);
  }
})();
