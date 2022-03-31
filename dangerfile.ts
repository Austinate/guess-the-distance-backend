import { message, danger, warn } from 'danger';
import { schedule } from 'danger';

// Disable ESLint warning import is not working here
// eslint-disable-next-line @typescript-eslint/no-var-requires
const reporter = require('danger-plugin-lint-report');

const modifiedMD = danger.git.modified_files.join('- ');
message('Changed Files in this PR: \n - ' + modifiedMD);

// Report ESLint result
schedule(
  reporter.scan({
    fileMask: '**/reports/lint-results.xml',
    reportSeverity: true,
    requireLineModification: true,
  }),
);

const app = danger.git.fileMatch('src/**/*.ts');
const tests = danger.git.fileMatch('src/**/*.spec.ts');

if (app.modified && !tests.modified) {
  warn('You have app changes without tests.');
}
