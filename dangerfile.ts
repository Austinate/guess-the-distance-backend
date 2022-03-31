import { message, danger, warn } from 'danger';

const modifiedMD = danger.git.modified_files.join('- ');
message('Changed Files in this PR: \n - ' + modifiedMD);

const app = danger.git.fileMatch('src/**/*.ts');
const tests = danger.git.fileMatch('src/**/*.spec.ts');

if (app.modified && !tests.modified) {
  warn('You have app changes without tests.');
}
