import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkorderDetailsComponent } from './workorder-details.component';

describe('WorkorderDetailsComponent', () => {
  let component: WorkorderDetailsComponent;
  let fixture: ComponentFixture<WorkorderDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WorkorderDetailsComponent]
    });
    fixture = TestBed.createComponent(WorkorderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
