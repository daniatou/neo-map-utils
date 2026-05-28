import { getBrowser } from './browser';
import { parseLayerParam, stringifyLayerParam } from './query-params';

export interface UrlSyncOptions {
  readonly queryKey?: string;
  readonly browser?: ReturnType<typeof getBrowser>;
}

export class LayerUrlSync {
  private readonly queryKey: string;
  private readonly browser: ReturnType<typeof getBrowser>;

  constructor(options: UrlSyncOptions = {}) {
    this.queryKey = options.queryKey ?? 'layers';
    this.browser = options.browser ?? getBrowser();
  }

  read(): readonly string[] {
    const href = this.browser?.location?.href;
    if (!href) {
      return [];
    }
    return parseLayerParam(new URL(href).searchParams.get(this.queryKey));
  }

  write(layerIds: readonly string[]): void {
    const location = this.browser?.location;
    const history = this.browser?.history;
    if (!location || !history) {
      return;
    }
    const url = new URL(location.href);
    const value = stringifyLayerParam(layerIds);
    if (value) {
      url.searchParams.set(this.queryKey, value);
    } else {
      url.searchParams.delete(this.queryKey);
    }
    history.replaceState(history.state, '', url);
  }
}
