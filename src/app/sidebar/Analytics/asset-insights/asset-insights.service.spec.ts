import { TestBed } from '@angular/core/testing';

import { AssetInsightsService } from './asset-insights.service';

describe('AssetInsightsService', () => {
  let service: AssetInsightsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssetInsightsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
