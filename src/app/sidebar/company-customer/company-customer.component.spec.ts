import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyCustomerComponent } from './company-customer.component';

describe('CompanyCustomerComponent', () => {
  let component: CompanyCustomerComponent;
  let fixture: ComponentFixture<CompanyCustomerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompanyCustomerComponent]
    });
    fixture = TestBed.createComponent(CompanyCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
