import { TestBed } from '@angular/core/testing';

import { CompanyCustomerDetailsService } from './company-customer-details.service';

describe('CompanyCustomerDetailsService', () => {
  let service: CompanyCustomerDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompanyCustomerDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
