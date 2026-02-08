import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetInspectionCompletionTrendComponent } from './asset-inspection-completion-trend.component';

describe('AssetInspectionCompletionTrendComponent', () => {
  let component: AssetInspectionCompletionTrendComponent;
  let fixture: ComponentFixture<AssetInspectionCompletionTrendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetInspectionCompletionTrendComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssetInspectionCompletionTrendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
