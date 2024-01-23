import { TestBed } from '@angular/core/testing';

import { TokenAuthenticationService } from './token-authentication.service';

describe('TokenAuthenticationService', () => {
  let service: TokenAuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenAuthenticationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
