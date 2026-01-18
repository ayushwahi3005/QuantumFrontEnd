import { TestBed } from '@angular/core/testing';

import { AssetInspectionService } from './asset-inspection.service';

describe('AssetInspectionService', () => {
  let service: AssetInspectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssetInspectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
