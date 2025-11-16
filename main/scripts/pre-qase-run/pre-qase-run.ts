import dotenv from 'dotenv-flow';
import { mkdirSync, writeFileSync } from 'fs';
import path from 'path';
import { QaseApi } from 'qaseio';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OD = 'OD';

dotenv.config({
  path: path.join(__dirname, '../../'),
  node_env: "test"
});

(async () => {
  try {
    console.log("QA Key: ", process.env.QASE_TESTOPS_API_TOKEN);
    const qase = new QaseApi({
      token: process.env.QASE_TESTOPS_API_TOKEN || '',
    });
    console.log("QASE_TESTOPS_PLAN_ID: ", process.env.QASE_TESTOPS_PLAN_ID);
    const planId = Number(process.env.QASE_TESTOPS_PLAN_ID || '1');
    const today = new Date().toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    });

    const {
      data: { result: plan },
    } = await qase.plans.getPlan(OD, planId);
    const {
      data: { result: run },
    } = await qase.runs.createRun(OD, {
      plan_id: planId,
      is_autotest: true,
      environment_slug: process.env.NEXT_PUBLIC_STAGE,
      title: `[Auto] ${today} | ${plan?.title} (PlanID: ${planId}, RunID: ${process.env.GITHUB_RUN_ID})`,
    });

    const dirname = path.join(__dirname, '../', 'tmp/qase');
    mkdirSync(dirname, { recursive: true });

    const ids = (plan?.cases?.map((c) => c.case_id) ?? []) as number[];
    writeFileSync(
      path.join(dirname, 'grep-pattern.txt'),
      `\\[${OD}-(${ids.join('|')})\\]`,
    );
    writeFileSync(path.join(dirname, 'run-id.txt'), run?.id?.toString() ?? '');

    console.log(
      '[pre-qase-run] Successfully created a test run with id:',
      run?.id,
    );
  } catch (e) {
    console.log('[pre-qase-run] Failure message:', e);
  }
})();
