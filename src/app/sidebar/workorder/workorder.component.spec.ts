import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkorderComponent } from './workorder.component';

describe('WorkorderComponent', () => {
  let component: WorkorderComponent;
  let fixture: ComponentFixture<WorkorderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WorkorderComponent]
    });
    fixture = TestBed.createComponent(WorkorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
