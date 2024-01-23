import { TestBed } from '@angular/core/testing';

import { AssetPreviewService } from './asset-preview.service';

describe('AssetPreviewService', () => {
  let service: AssetPreviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssetPreviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
