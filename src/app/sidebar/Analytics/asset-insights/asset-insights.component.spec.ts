import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetInsightsComponent } from './asset-insights.component';

describe('AssetInsightsComponent', () => {
  let component: AssetInsightsComponent;
  let fixture: ComponentFixture<AssetInsightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetInsightsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssetInsightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
