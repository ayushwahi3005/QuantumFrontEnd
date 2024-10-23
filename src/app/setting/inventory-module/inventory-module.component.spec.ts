import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryModuleComponent } from './inventory-module.component';

describe('InventoryModuleComponent', () => {
  let component: InventoryModuleComponent;
  let fixture: ComponentFixture<InventoryModuleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InventoryModuleComponent]
    });
    fixture = TestBed.createComponent(InventoryModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
