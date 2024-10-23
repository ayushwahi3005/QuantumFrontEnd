import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyCustomerDetailsComponent } from './company-customer-details.component';

describe('CompanyCustomerDetailsComponent', () => {
  let component: CompanyCustomerDetailsComponent;
  let fixture: ComponentFixture<CompanyCustomerDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompanyCustomerDetailsComponent]
    });
    fixture = TestBed.createComponent(CompanyCustomerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
