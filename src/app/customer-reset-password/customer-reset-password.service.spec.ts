import { TestBed } from '@angular/core/testing';

import { CustomerResetPasswordService } from './customer-reset-password.service';

describe('CustomerResetPasswordService', () => {
  let service: CustomerResetPasswordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerResetPasswordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
