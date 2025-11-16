import dotenv from 'dotenv-flow';
import { QaseApi } from 'qaseio';
import fs from 'fs';
import path from 'path';

const GP = 'GP';

dotenv.config({
  node_env: process.env.CI ? 'production' : process.env.NODE_ENV || 'test',
});

(async () => {
  try {
    const runIdPath = path.join(process.cwd(), 'tmp/qase/run-id.txt');
    const runId = Number(fs.readFileSync(runIdPath, 'utf-8'));
    const resultPath = path.join(process.cwd(), 'tmp/qase/result.json');
    const resultRaw = fs.readFileSync(resultPath, 'utf-8');
    const testResult = JSON.parse(resultRaw);

    const qase = new QaseApi({
      token: process.env.QASE_TESTOPS_API_TOKEN || '',
    });

    for (const test of testResult.tests) {
      // map caseId và status
      const case_id = test.caseId; // hoặc lấy từ grep-pattern.txt
      const status_map: Record<string, number> = {
        passed: 1,
        failed: 5,
        skipped: 2,
      };

      await qase.results.createResult(GP, runId, {
        case_id,
        status: status_map[test.status]?.toString() ?? '5', // default failed
        comment: test.error || '',
      });
      console.log(`[post-qase-run] Posted result for case ${case_id}: ${test.status}`);
    }

    await qase.runs.completeRun(GP, runId);
    console.log('[post-qase-run] Successfully completed test run:', runId);
  } catch (e) {
    console.error('[post-qase-run] Failure message:', e);
  }
})();
