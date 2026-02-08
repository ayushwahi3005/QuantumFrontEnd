import { TestBed } from '@angular/core/testing';

import { AssetInspectionCompletionTrendService } from './asset-inspection-completion-trend.service';

describe('AssetInspectionCompletionTrendService', () => {
  let service: AssetInspectionCompletionTrendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssetInspectionCompletionTrendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
