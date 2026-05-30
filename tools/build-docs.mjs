import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { dirname, extname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));
const websiteDir = join(rootDir, 'website');
const sourceDocsDir = join(rootDir, 'docs');
const websiteDocsDir = join(websiteDir, 'docs');
const guideDocsDir = join(websiteDocsDir, 'guides');
const sourceAssetsDir = join(sourceDocsDir, 'assets');
const websiteImagesDir = join(websiteDir, 'static', 'img');
const args = new Set(process.argv.slice(2));

function ensureSupportedNodeVersion() {
  const major = Number.parseInt(process.versions.node.split('.')[0] ?? '0', 10);

  if (major >= 23 && !args.has('--allow-unsupported-node')) {
    console.error(
      [
        `Node ${process.versions.node} detected.`,
        'Docusaurus static builds are currently unstable on Node 23+ in this workspace.',
        'Use Node 22 LTS for local docs and GitHub Actions, or pass --allow-unsupported-node to test anyway.'
      ].join('\n')
    );
    process.exit(1);
  }
}

function copyMarkdownGuides() {
  mkdirSync(guideDocsDir, { recursive: true });

  for (const fileName of readdirSync(guideDocsDir)) {
    if (extname(fileName) === '.md' || extname(fileName) === '.mdx') {
      rmSync(join(guideDocsDir, fileName), { force: true });
    }
  }

  if (!existsSync(sourceDocsDir)) {
    return;
  }

  for (const fileName of readdirSync(sourceDocsDir)) {
    if (extname(fileName) !== '.md') {
      continue;
    }

    cpSync(join(sourceDocsDir, fileName), join(guideDocsDir, fileName));
  }
}

function copyStaticAssets() {
  if (!existsSync(sourceAssetsDir)) {
    return;
  }

  rmSync(websiteImagesDir, { recursive: true, force: true });
  mkdirSync(websiteImagesDir, { recursive: true });
  cpSync(sourceAssetsDir, websiteImagesDir, { recursive: true });
}

function run(command, commandArgs) {
  const result = spawnSync(command, commandArgs, {
    cwd: rootDir,
    env: {
      ...process.env,
      CI: process.env.CI ?? 'true',
      DOCUSAURUS_BASE_URL: process.env.DOCUSAURUS_BASE_URL ?? (args.has('--serve') ? '/' : '/neo-map-utils/'),
      NEO_MAPS_DOCS_BUILD: 'true'
    },
    stdio: 'inherit',
    shell: process.platform === 'win32'
  });

  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

copyMarkdownGuides();
copyStaticAssets();

if (args.has('--prepare-only')) {
  process.exit(0);
}

const command = process.env.NEO_MAPS_PNPM_COMMAND ?? (process.platform === 'win32' ? 'corepack.cmd' : 'corepack');
const pnpmArgs = process.env.NEO_MAPS_PNPM_COMMAND ? [] : ['pnpm'];

run(command, [...pnpmArgs, '--dir', 'website', 'run', 'clear']);
run(command, [...pnpmArgs, '--dir', 'website', 'run', 'api:generate']);

if (args.has('--api-only')) {
  process.exit(0);
}

ensureSupportedNodeVersion();

if (args.has('--serve')) {
  run(command, [...pnpmArgs, '--dir', 'website', 'run', 'start']);
} else {
  run(command, [...pnpmArgs, '--dir', 'website', 'run', 'build']);
}
