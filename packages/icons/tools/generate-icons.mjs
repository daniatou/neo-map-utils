import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const iconsRoot = resolve(workspaceRoot, 'packages/icons');
const manifestPath = resolve(iconsRoot, 'icon-manifest.json');
const generatedRoot = resolve(iconsRoot, 'src/generated');

const bankFiles = {
  feather: 'feather.svg',
  'heroicons-mini': 'heroicons-mini.svg',
  'heroicons-outline': 'heroicons-outline.svg',
  'heroicons-solid': 'heroicons-solid.svg',
  'material-outline': 'material-outline.svg',
  'material-solid': 'material-solid.svg',
  'material-twotone': 'material-twotone.svg'
};

const unsafeSvgPattern = /<script|on\w+=|foreignObject|javascript:|data:/i;

async function main() {
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  const banks = await loadBanks();
  const packExports = [];

  await mkdir(generatedRoot, { recursive: true });

  for (const pack of manifest.packs) {
    const icons = {};
    for (const [name, variants] of Object.entries(pack.icons)) {
      icons[name] = {};
      for (const [variant, reference] of Object.entries(variants)) {
        icons[name][variant] = resolveReference(banks, reference);
      }
    }

    const exportName = toIdentifier(`${pack.name}IconPack`);
    const iconsName = toIdentifier(`${pack.name}Icons`);
    const outputPath = resolve(generatedRoot, pack.output);
    const source = [
      "import type { IconPack } from '../lib/icon-registry';",
      '',
      `export const ${iconsName} = ${JSON.stringify(icons, null, 2)} as const;`,
      '',
      `export const ${exportName}: IconPack = {`,
      `  name: ${JSON.stringify(pack.name)},`,
      `  icons: ${iconsName}`,
      '};',
      ''
    ].join('\n');

    await writeFile(outputPath, source, 'utf8');
    packExports.push({ output: pack.output.replace(/\.ts$/, ''), exportName });
  }

  await writeFile(
    resolve(generatedRoot, 'icon-packs.ts'),
    [
      ...packExports.map((item) => `export { ${item.exportName} } from './${item.output}';`),
      ''
    ].join('\n'),
    'utf8'
  );
}

async function loadBanks() {
  const banks = {};
  for (const [name, filename] of Object.entries(bankFiles)) {
    const source = await readFile(resolve(iconsRoot, filename), 'utf8');
    banks[name] = extractIcons(source);
  }
  return banks;
}

function resolveReference(banks, reference) {
  const [bankName, iconId] = reference.split(':');
  const icon = banks[bankName]?.[iconId];
  if (!icon) {
    throw new Error(`Icon reference not found: ${reference}`);
  }
  return icon;
}

function extractIcons(source) {
  const icons = {};
  for (const match of source.matchAll(/<(svg|symbol)\b([^>]*)\bid="([^"]+)"([^>]*)>([\s\S]*?)<\/\1>/g)) {
    const tag = match[1];
    const attributes = `${match[2]} ${match[4]}`;
    const id = match[3];
    const body = match[5].trim();
    const viewBox = readAttribute(attributes, 'viewBox') ?? '0 0 24 24';
    const fill = readAttribute(attributes, 'fill');
    const stroke = readAttribute(attributes, 'stroke');
    const strokeWidth = readAttribute(attributes, 'stroke-width');
    const extra = [
      fill ? `fill="${fill}"` : tag === 'symbol' ? 'fill="currentColor"' : '',
      stroke ? `stroke="${stroke}"` : '',
      strokeWidth ? `stroke-width="${strokeWidth}"` : ''
    ]
      .filter(Boolean)
      .join(' ');
    const svg = `<svg viewBox="${viewBox}" ${extra}>${body}</svg>`.replace(/\s+/g, ' ').trim();
    if (unsafeSvgPattern.test(svg)) {
      throw new Error(`Unsafe SVG rejected: ${id}`);
    }
    icons[id] = svg;
  }
  return icons;
}

function readAttribute(attributes, name) {
  const match = attributes.match(new RegExp(`${name}="([^"]+)"`));
  return match?.[1];
}

function toIdentifier(value) {
  return value.replace(/(^|[-_\s]+)(\w)/g, (_match, _prefix, char) => char.toUpperCase()).replace(/^\w/, (char) => char.toLowerCase());
}

await main();
