import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LayerPanelComponent } from './layer-panel.component';

describe('LayerPanelComponent', () => {
  let fixture: ComponentFixture<LayerPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayerPanelComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LayerPanelComponent);
    fixture.componentRef.setInput('config', {
      groups: [{ id: 'base', name: 'Base', expanded: true, layers: [{ id: 'roads', name: 'Roads', type: 'tile' }] }]
    });
    fixture.detectChanges();
  });

  it('renders layer groups', () => {
    expect(fixture.nativeElement.textContent).toContain('Base');
    expect(fixture.nativeElement.textContent).toContain('Roads');
  });
});
