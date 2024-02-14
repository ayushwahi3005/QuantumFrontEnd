import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkorderModuleComponent } from './workorder-module.component';

describe('WorkorderModuleComponent', () => {
  let component: WorkorderModuleComponent;
  let fixture: ComponentFixture<WorkorderModuleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WorkorderModuleComponent]
    });
    fixture = TestBed.createComponent(WorkorderModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
