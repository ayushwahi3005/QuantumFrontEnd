import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerModuleComponent } from './customer-module.component';

describe('CustomerModuleComponent', () => {
  let component: CustomerModuleComponent;
  let fixture: ComponentFixture<CustomerModuleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerModuleComponent]
    });
    fixture = TestBed.createComponent(CustomerModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
