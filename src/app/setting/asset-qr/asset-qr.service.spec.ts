import { TestBed } from '@angular/core/testing';

import { AssetQRService } from './asset-qr.service';

describe('AssetQRService', () => {
  let service: AssetQRService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssetQRService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
