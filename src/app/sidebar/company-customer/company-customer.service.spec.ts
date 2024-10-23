import { TestBed } from '@angular/core/testing';

import { CompanyCustomerService } from './company-customer.service';

describe('CompanyCustomerService', () => {
  let service: CompanyCustomerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompanyCustomerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
