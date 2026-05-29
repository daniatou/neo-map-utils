import { ChangeDetectionStrategy, Component, InjectionToken, Input, inject } from '@angular/core';
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser';
import { createIconRegistry, type IconRegistry, type IconVariant } from '@neo-maps/layer-panel-icons';

export const LLP_ICON_REGISTRY = new InjectionToken<IconRegistry>('LLP_ICON_REGISTRY', {
  providedIn: 'root',
  factory: () => createIconRegistry()
});

@Component({
  selector: 'llp-icon',
  standalone: true,
  template:
    '<span class="llp-icon__svg" aria-hidden="true" [innerHTML]="svg"></span>',
  host: {
    class: 'llp-icon inline-flex shrink-0 text-current'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LlpIconComponent {
  @Input({ required: true }) name!: string;
  @Input() variant: IconVariant = 'outline';

  private readonly registry = inject(LLP_ICON_REGISTRY);
  private readonly sanitizer = inject(DomSanitizer);

  get svg(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.registry.get(this.name, this.variant));
  }
}
