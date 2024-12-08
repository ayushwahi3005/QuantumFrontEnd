import { TestBed } from '@angular/core/testing';

import { ResetPasswordAdminService } from './reset-password-admin.service';

describe('ResetPasswordAdminService', () => {
  let service: ResetPasswordAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResetPasswordAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
