import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectionTemplateComponent } from './inspection-template.component';

describe('InspectionTemplateComponent', () => {
  let component: InspectionTemplateComponent;
  let fixture: ComponentFixture<InspectionTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InspectionTemplateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InspectionTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
