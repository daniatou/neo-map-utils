export interface LayerRuleContext {
  readonly zoom?: number;
  readonly metadata?: Readonly<Record<string, unknown>>;
}

export interface LayerVisibilityRule {
  readonly id: string;
  matches(context: LayerRuleContext): boolean;
}

export function canShowAtZoom(
  zoom: number | undefined,
  minZoom: number | undefined,
  maxZoom: number | undefined
): boolean {
  if (typeof zoom !== 'number') {
    return true;
  }
  return zoom >= (minZoom ?? Number.NEGATIVE_INFINITY) && zoom <= (maxZoom ?? Number.POSITIVE_INFINITY);
}
