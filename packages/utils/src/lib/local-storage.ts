import { getBrowser } from './browser';

export class JsonStorage<T> {
  constructor(
    private readonly key: string,
    private readonly fallback: T,
    private readonly storage: Storage | undefined = getBrowser()?.localStorage
  ) {}

  read(): T {
    if (!this.storage) {
      return this.fallback;
    }
    const raw = this.storage.getItem(this.key);
    if (!raw) {
      return this.fallback;
    }
    try {
      return JSON.parse(raw) as T;
    } catch {
      return this.fallback;
    }
  }

  write(value: T): void {
    this.storage?.setItem(this.key, JSON.stringify(value));
  }
}
