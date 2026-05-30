import { existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const showcaseName = process.argv[2];

if (!showcaseName) {
  console.error('Missing showcase name.');
  console.error('Usage: npm run showcase <folder-name>');
  console.error('Example: npm run showcase demo-angular');
  process.exit(1);
}

if (showcaseName.includes('/') || showcaseName.includes('\\') || showcaseName.startsWith('.')) {
  console.error(`Invalid showcase name: ${showcaseName}`);
  process.exit(1);
}

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const showcaseDir = join(root, 'showcases', showcaseName);
const packageJson = join(showcaseDir, 'package.json');

if (!existsSync(showcaseDir)) {
  console.error(`Showcase not found: showcases/${showcaseName}`);
  process.exit(1);
}

if (!existsSync(packageJson)) {
  console.error(`Missing package.json in showcases/${showcaseName}`);
  process.exit(1);
}

console.log(`Installing showcase dependencies: ${showcaseName}`);

const install = spawn('npm', ['install'], {
  cwd: showcaseDir,
  stdio: 'inherit',
  shell: process.platform === 'win32'
});

install.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  if (code !== 0) {
    process.exit(code ?? 1);
  }

  console.log(`Starting showcase: ${showcaseName}`);

  const start = spawn('npm', ['start'], {
    cwd: showcaseDir,
    stdio: 'inherit',
    shell: process.platform === 'win32'
  });

  start.on('exit', (startCode, startSignal) => {
    if (startSignal) {
      process.kill(process.pid, startSignal);
      return;
    }
    process.exit(startCode ?? 0);
  });
});
