import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));
const tmpDir = join(rootDir, 'tmp', 'package-test');
const backupDir = join(tmpDir, 'backups');
const packDir = join(tmpDir, 'packs');
const tsconfigPath = join(rootDir, 'tsconfig.base.json');
const packageJsonPath = join(rootDir, 'package.json');
const lockfilePath = join(rootDir, 'pnpm-lock.yaml');
const demoStylesPath = join(rootDir, 'development', 'demo-angular-local', 'src', 'styles.css');
const command = process.argv[2] ?? 'serve';

const packageProjects = ['core', 'theme', 'adapter-angular'];
const packTargets = [
  join(rootDir, 'dist', 'packages', 'core'),
  join(rootDir, 'dist', 'packages', 'theme'),
  join(rootDir, 'dist', 'packages', 'adapter-angular')
];

function run(executable, args, options = {}) {
  const result = spawnSync(executable, args, {
    cwd: options.cwd ?? rootDir,
    env: { ...process.env, NX_DAEMON: 'false' },
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

function runWithOutput(executable, args, cwd) {
  const result = spawnSync(executable, args, {
    cwd,
    env: { ...process.env },
    encoding: 'utf8',
    shell: process.platform === 'win32'
  });

  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.stdout.write(result.stdout ?? '');
    process.stderr.write(result.stderr ?? '');
    process.exit(result.status ?? 1);
  }

  return result.stdout.trim();
}

function ensureBackup() {
  mkdirSync(backupDir, { recursive: true });

  const tsconfigBackup = join(backupDir, 'tsconfig.base.json');
  const stylesBackup = join(backupDir, 'styles.css');
  const packageJsonBackup = join(backupDir, 'package.json');
  const lockfileBackup = join(backupDir, 'pnpm-lock.yaml');

  if (!existsSync(tsconfigBackup)) {
    cpSync(tsconfigPath, tsconfigBackup);
  }

  if (!existsSync(stylesBackup)) {
    cpSync(demoStylesPath, stylesBackup);
  }

  if (!existsSync(packageJsonBackup)) {
    cpSync(packageJsonPath, packageJsonBackup);
  }

  if (!existsSync(lockfileBackup)) {
    cpSync(lockfilePath, lockfileBackup);
  }
}

function patchWorkspaceForPackageResolution() {
  const tsconfig = JSON.parse(readFileSync(tsconfigPath, 'utf8'));
  const paths = tsconfig.compilerOptions?.paths ?? {};

  for (const key of Object.keys(paths)) {
    if (key.startsWith('@neo-maps/')) {
      delete paths[key];
    }
  }

  tsconfig.compilerOptions.paths = paths;
  writeFileSync(tsconfigPath, `${JSON.stringify(tsconfig, null, 2)}\n`);

  let styles = readFileSync(demoStylesPath, 'utf8');
  styles = styles.replace(
    "@import '../../../packages/theme/src/styles/theme.css';",
    "@import '@neo-maps/layer-panel-theme/styles/theme.css';"
  );
  styles = styles.replace(
    "@import '../../../packages/adapter-angular/src/styles.css';",
    "@import '@neo-maps/leaflet-layer-panel-angular/styles.css';"
  );
  writeFileSync(demoStylesPath, styles);
}

function buildAndPack() {
  rmSync(packDir, { recursive: true, force: true });
  mkdirSync(packDir, { recursive: true });

  const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  run(npx, ['nx', 'run-many', '-t', 'build', `--projects=${packageProjects.join(',')}`, '--skip-nx-cache']);

  const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const tarballs = [];

  for (const target of packTargets) {
    const output = runWithOutput(npm, ['pack', '--pack-destination', packDir], target);
    const fileName = output.split(/\r?\n/).filter(Boolean).at(-1);
    if (!fileName) {
      console.error(`Unable to read npm pack output for ${target}`);
      process.exit(1);
    }
    tarballs.push(resolve(packDir, fileName));
  }

  return tarballs;
}

function installTarballs(tarballs) {
  const corepack = process.platform === 'win32' ? 'corepack.cmd' : 'corepack';
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
  const tarballByPackage = {
    '@neo-maps/leaflet-layer-panel': tarballs.find((tarball) =>
      tarball.includes('neo-maps-leaflet-layer-panel-')
    ),
    '@neo-maps/layer-panel-theme': tarballs.find((tarball) =>
      tarball.includes('neo-maps-layer-panel-theme-')
    ),
    '@neo-maps/leaflet-layer-panel-angular': tarballs.find((tarball) =>
      tarball.includes('neo-maps-leaflet-layer-panel-angular-')
    )
  };

  for (const [packageName, tarball] of Object.entries(tarballByPackage)) {
    if (!tarball) {
      console.error(`Missing tarball for ${packageName}`);
      process.exit(1);
    }
  }

  packageJson.dependencies = {
    ...(packageJson.dependencies ?? {}),
    ...Object.fromEntries(
      Object.entries(tarballByPackage).map(([packageName, tarball]) => [packageName, toFileSpecifier(tarball)])
    )
  };
  packageJson.pnpm = {
    ...(packageJson.pnpm ?? {}),
    overrides: {
      ...(packageJson.pnpm?.overrides ?? {}),
      '@neo-maps/leaflet-layer-panel': toFileSpecifier(tarballByPackage['@neo-maps/leaflet-layer-panel']),
      '@neo-maps/layer-panel-theme': toFileSpecifier(tarballByPackage['@neo-maps/layer-panel-theme'])
    }
  };

  writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);

  try {
    runInstall(corepack, ['pnpm', 'install']);
  } finally {
    restorePackageMetadata();
  }
}

function toFileSpecifier(filePath) {
  return `file:${filePath.replace(/\\/g, '/')}`;
}

function runInstall(executable, args) {
  const result = spawnSync(executable, args, {
    cwd: rootDir,
    env: { ...process.env },
    stdio: 'inherit',
    shell: process.platform === 'win32'
  });

  if (result.error) {
    console.error(result.error.message);
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(`Command failed with exit code ${result.status}: ${executable} ${args.join(' ')}`);
  }
}

function restorePackageMetadata() {
  const packageJsonBackup = join(backupDir, 'package.json');
  const lockfileBackup = join(backupDir, 'pnpm-lock.yaml');

  if (existsSync(packageJsonBackup)) {
    cpSync(packageJsonBackup, packageJsonPath);
  }

  if (existsSync(lockfileBackup)) {
    cpSync(lockfileBackup, lockfilePath);
  }
}

function prepare() {
  ensureBackup();
  const tarballs = buildAndPack();
  installTarballs(tarballs);
  patchWorkspaceForPackageResolution();

  console.log('\nPackage test mode is ready.');
  console.log('The local demo now resolves @neo-maps packages from node_modules.');
  console.log('Run: corepack pnpm dev:package-test:serve');
  console.log('Restore later with: corepack pnpm dev:package-test:restore\n');
}

function restore() {
  const tsconfigBackup = join(backupDir, 'tsconfig.base.json');
  const stylesBackup = join(backupDir, 'styles.css');

  if (existsSync(tsconfigBackup)) {
    cpSync(tsconfigBackup, tsconfigPath);
  }

  if (existsSync(stylesBackup)) {
    cpSync(stylesBackup, demoStylesPath);
  }

  restorePackageMetadata();

  rmSync(tmpDir, { recursive: true, force: true });
  console.log('Package test mode restored.');
}

function serve() {
  prepare();

  const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  const result = spawnSync(npx, ['nx', 'serve', 'demo-angular-local'], {
    cwd: rootDir,
    env: { ...process.env, NX_DAEMON: 'false' },
    stdio: 'inherit',
    shell: process.platform === 'win32'
  });

  restore();
  process.exit(result.status ?? 0);
}

if (command === 'prepare') {
  prepare();
} else if (command === 'restore') {
  restore();
} else if (command === 'serve') {
  serve();
} else {
  console.error(`Unknown command: ${command}`);
  console.error('Use one of: prepare, serve, restore');
  process.exit(1);
}
