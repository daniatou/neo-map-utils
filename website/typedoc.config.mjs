export default {
  name: 'Neo Maps API',
  entryPoints: [
    '../packages/core/src/index.ts',
    '../packages/adapter-angular/src/index.ts',
    '../packages/icons/src/index.ts',
    '../packages/theme/src/index.ts',
    '../packages/utils/src/index.ts',
    '../packages/ui-headless/src/index.ts'
  ],
  entryPointStrategy: 'expand',
  tsconfig: '../tsconfig.base.json',
  out: 'docs/api',
  readme: 'none',
  plugin: ['typedoc-plugin-markdown'],
  cleanOutputDir: true,
  excludePrivate: true,
  excludeProtected: true,
  skipErrorChecking: true,
  hideGenerator: true,
  categorizeByGroup: true
};
