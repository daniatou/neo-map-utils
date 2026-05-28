export interface BrowserLike {
  readonly location?: Location;
  readonly history?: History;
  readonly localStorage?: Storage;
}

export function getBrowser(): BrowserLike | undefined {
  return typeof globalThis.window === 'undefined' ? undefined : globalThis.window;
}

export function isBrowser(): boolean {
  return typeof globalThis.window !== 'undefined' && typeof globalThis.document !== 'undefined';
}
