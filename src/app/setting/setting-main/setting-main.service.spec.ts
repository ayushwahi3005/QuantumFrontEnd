import { TestBed } from '@angular/core/testing';

import { SettingMainService } from './setting-main.service';

describe('SettingMainService', () => {
  let service: SettingMainService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SettingMainService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
