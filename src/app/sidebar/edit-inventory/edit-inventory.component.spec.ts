import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInventoryComponent } from './edit-inventory.component';

describe('EditInventoryComponent', () => {
  let component: EditInventoryComponent;
  let fixture: ComponentFixture<EditInventoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditInventoryComponent]
    });
    fixture = TestBed.createComponent(EditInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
