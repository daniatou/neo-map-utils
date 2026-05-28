export type IconVariant = 'solid' | 'outline';

export interface IconDefinition {
  readonly solid?: string;
  readonly outline?: string;
}

export interface IconPack {
  readonly name: string;
  readonly icons: Readonly<Record<string, IconDefinition>>;
}

const unsafeSvgPattern = /<script|on\w+=|foreignObject|javascript:|data:/i;

export class IconRegistry {
  private readonly icons = new Map<string, IconDefinition>();

  constructor(private readonly fallback: IconDefinition = {}) {}

  register(name: string, definition: IconDefinition): void {
    this.icons.set(name, sanitizeDefinition(definition));
  }

  registerMany(definitions: Readonly<Record<string, IconDefinition>>): void {
    for (const [name, definition] of Object.entries(definitions)) {
      this.register(name, definition);
    }
  }

  registerPack(pack: IconPack): void {
    this.registerMany(pack.icons);
  }

  get(name: string, variant: IconVariant = 'outline'): string {
    const definition = this.icons.get(name) ?? this.fallback;
    return definition[variant] ?? definition.outline ?? definition.solid ?? '';
  }

  has(name: string): boolean {
    return this.icons.has(name);
  }

  names(): readonly string[] {
    return [...this.icons.keys()].sort();
  }
}

export function sanitizeSvg(svg: string | undefined): string | undefined {
  if (!svg) {
    return undefined;
  }
  if (unsafeSvgPattern.test(svg)) {
    throw new Error('Unsafe SVG icon definition rejected.');
  }
  return svg;
}

function sanitizeDefinition(definition: IconDefinition): IconDefinition {
  return {
    solid: sanitizeSvg(definition.solid),
    outline: sanitizeSvg(definition.outline)
  };
}
