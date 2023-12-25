import { TestBed } from '@angular/core/testing';

import { AssetModuleService } from './asset-module.service';

describe('AssetModuleService', () => {
  let service: AssetModuleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssetModuleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
