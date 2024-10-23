import { TestBed } from '@angular/core/testing';

import { CompanyCustomerDetailsPreviewService } from './company-customer-details-preview.service';

describe('CompanyCustomerDetailsPreviewService', () => {
  let service: CompanyCustomerDetailsPreviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompanyCustomerDetailsPreviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
