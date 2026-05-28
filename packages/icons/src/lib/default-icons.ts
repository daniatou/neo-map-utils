import type { IconDefinition, IconPack } from './icon-registry';

export const defaultIcons: Readonly<Record<string, IconDefinition>> = {
  layers: {
    outline:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 16 9 5 9-5"/></svg>',
    solid:
      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2.5 10 5.6-10 5.6L2 8.1l10-5.6Z"/><path d="m2 12.1 10 5.6 10-5.6v2.4l-10 5.6-10-5.6v-2.4Z"/></svg>'
  },
  search: {
    outline:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.4-3.4"/></svg>'
  },
  chevron: {
    outline:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>'
  }
};

export const defaultIconPack: IconPack = {
  name: 'llp-default',
  icons: defaultIcons
};
