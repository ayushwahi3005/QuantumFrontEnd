import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkorderCategoryComponent } from './workorder-category.component';

describe('WorkorderCategoryComponent', () => {
  let component: WorkorderCategoryComponent;
  let fixture: ComponentFixture<WorkorderCategoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WorkorderCategoryComponent]
    });
    fixture = TestBed.createComponent(WorkorderCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
