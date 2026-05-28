export type PanelVariant = 'default' | 'compact' | 'enterprise' | 'floating' | 'minimal';
export type PanelMode = 'glassmorphism' | 'flat' | 'bordered' | 'elevated';

export interface ThemeInput {
  readonly primary?: string;
  readonly surface?: string;
  readonly panelBackground?: string;
  readonly text?: string;
  readonly muted?: string;
  readonly border?: string;
  readonly radius?: string;
  readonly shadow?: string;
  readonly spacing?: string;
  readonly fontFamily?: string;
  readonly variant?: PanelVariant;
  readonly mode?: PanelMode;
}

export function createTheme(input: ThemeInput = {}): string {
  const entries: Record<string, string> = {
    '--llp-primary': toRgb(input.primary ?? '#2563eb'),
    '--llp-surface': toRgb(input.surface ?? '#ffffff'),
    '--llp-panel': toRgb(input.panelBackground ?? '#f8fafc'),
    '--llp-text': toRgb(input.text ?? '#0f172a'),
    '--llp-muted': toRgb(input.muted ?? '#64748b'),
    '--llp-border': toRgb(input.border ?? '#cbd5e1'),
    '--llp-radius': input.radius ?? '18px',
    '--llp-shadow-soft': input.shadow ?? '0 4px 20px rgba(15, 23, 42, 0.08)',
    '--llp-spacing': input.spacing ?? '0.75rem',
    '--llp-font-family': input.fontFamily ?? 'Inter, ui-sans-serif, system-ui, sans-serif',
    '--llp-panel-blur': input.mode === 'glassmorphism' ? '18px' : '0px',
    '--llp-panel-border-width': input.mode === 'flat' ? '0px' : '1px'
  };

  return `:root {\n${Object.entries(entries)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n')}\n}`;
}

function toRgb(value: string): string {
  const normalized = value.replace('#', '');
  if (!/^[\da-f]{6}$/i.test(normalized)) {
    return value;
  }
  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);
  return `${red} ${green} ${blue}`;
}
