import type { LayerPanelState } from './models';

export type StateSubscriber = (state: LayerPanelState) => void;

export class LayerPanelStore {
  private state: LayerPanelState;
  private readonly subscribers = new Set<StateSubscriber>();

  constructor(initialState: LayerPanelState) {
    this.state = initialState;
  }

  snapshot(): LayerPanelState {
    return this.state;
  }

  update(project: (state: LayerPanelState) => LayerPanelState): LayerPanelState {
    this.state = project(this.state);
    for (const subscriber of this.subscribers) {
      subscriber(this.state);
    }
    return this.state;
  }

  subscribe(subscriber: StateSubscriber): () => void {
    this.subscribers.add(subscriber);
    subscriber(this.state);
    return () => this.subscribers.delete(subscriber);
  }
}
