import { TestBed } from '@angular/core/testing';

import { CustomerModuleService } from './customer-module.service';

describe('CustomerModuleService', () => {
  let service: CustomerModuleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerModuleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
