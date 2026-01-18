import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetInspectionComponent } from './asset-inspection.component';

describe('AssetInspectionComponent', () => {
  let component: AssetInspectionComponent;
  let fixture: ComponentFixture<AssetInspectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetInspectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssetInspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
