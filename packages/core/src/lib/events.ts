import type { LayerPanelEvent, LayerPanelState, Listener, UnsubscribeFn } from './models';

export class LayerPanelEventBus {
  private readonly listeners = new Set<Listener>();

  emit(event: LayerPanelEvent, state: LayerPanelState): void {
    for (const listener of this.listeners) {
      listener(event, state);
    }
  }

  subscribe(listener: Listener): UnsubscribeFn {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}
