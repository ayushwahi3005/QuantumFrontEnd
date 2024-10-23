import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyCustomerDetailsPreviewComponent } from './company-customer-details-preview.component';

describe('CompanyCustomerDetailsPreviewComponent', () => {
  let component: CompanyCustomerDetailsPreviewComponent;
  let fixture: ComponentFixture<CompanyCustomerDetailsPreviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompanyCustomerDetailsPreviewComponent]
    });
    fixture = TestBed.createComponent(CompanyCustomerDetailsPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
