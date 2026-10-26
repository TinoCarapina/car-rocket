// One command setup: node scripts/setup.mjs   (or: npm run setup)
import { execSync } from 'node:child_process';
import fs from 'node:fs';
const run = c => { console.log('\n> ' + c); execSync(c, { stdio: 'inherit' }); };
const mac = process.platform === 'darwin';
if (!fs.existsSync('android')) run('npx cap add android');
if (mac && !fs.existsSync('ios')) run('npx cap add ios');
run('node scripts/patch-native.mjs');
run('npx capacitor-assets generate --android' + (mac ? ' --ios' : ''));
run('npx cap sync');
console.log('\nDone. Next: npm run android' + (mac ? '  or  npm run ios' : '') + '\n');
