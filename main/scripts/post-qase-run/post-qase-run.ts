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

        // Build detailed comment with failure information
        let comment = '';

        if (status === 'failed' && result) {
          const error = result.error;
          const errors = result.errors || [];
          const attachments = result.attachments || [];
          const stdout = result.stdout || [];
          const stderr = result.stderr || [];

          // Error message and stack trace
          if (error?.message) {
            comment += `## Error Message\n\n${error.message}\n\n`;
          }

          if (error?.stack) {
            // Clean ANSI codes from stack trace
            const cleanStack = error.stack.replace(/\u001b\[[0-9;]*m/g, '');
            comment += `## Stack Trace\n\n\`\`\`\n${cleanStack}\n\`\`\`\n\n`;
          }

          // Code snippet showing error location
          if (error?.snippet) {
            // Clean ANSI codes from snippet
            const cleanSnippet = error.snippet.replace(/\u001b\[[0-9;]*m/g, '');
            comment += `## Error Location\n\n\`\`\`\n${cleanSnippet}\n\`\`\`\n\n`;
          }

          // Error location details
          if (result.errorLocation) {
            const loc = result.errorLocation;
            comment += `## File Location\n\nFile: \`${loc.file}\`\nLine: ${loc.line}\nColumn: ${loc.column}\n\n`;
          }

          // Test duration
          if (result.duration) {
            const durationSeconds = (result.duration / 1000).toFixed(2);
            comment += `## Test Duration\n\n${durationSeconds} seconds\n\n`;
          }

          // Attachments (screenshots, videos, traces)
          if (attachments.length > 0) {
            comment += `## Attachments\n\n`;
            attachments.forEach((attachment: any) => {
              const attachmentType = attachment.name === 'screenshot' ? '📸 Screenshot' :
                attachment.name === 'video' ? '🎥 Video' :
                  attachment.name === 'trace' ? '📋 Trace' :
                    attachment.name === 'error-context' ? '📄 Error Context' :
                      attachment.name;
              comment += `- **${attachmentType}**: \`${attachment.path}\`\n`;
            });
            comment += `\n`;
          }

          // Console output
          if (stdout.length > 0) {
            comment += `## Console Output (stdout)\n\n\`\`\`\n`;
            stdout.forEach((out: any) => {
              const cleanOutput = (out.text || '').replace(/\u001b\[[0-9;]*m/g, '');
              comment += cleanOutput;
            });
            comment += `\n\`\`\`\n\n`;
          }

          // Error output
          if (stderr.length > 0) {
            comment += `## Error Output (stderr)\n\n\`\`\`\n`;
            stderr.forEach((err: any) => {
              const cleanError = (err.text || '').replace(/\u001b\[[0-9;]*m/g, '');
              comment += cleanError;
            });
            comment += `\n\`\`\`\n\n`;
          }

          // Additional error details if available
          if (errors.length > 1) {
            comment += `## Additional Errors\n\n`;
            errors.slice(1).forEach((err: any, index: number) => {
              const cleanMessage = (err.message || '').replace(/\u001b\[[0-9;]*m/g, '');
              comment += `### Error ${index + 2}\n\n${cleanMessage}\n\n`;
            });
          }

          // Remove trailing newlines
          comment = comment.trim();
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
