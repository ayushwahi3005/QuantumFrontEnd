import { TestBed } from '@angular/core/testing';

import { SettingHomeService } from './setting-home.service';

describe('SettingHomeService', () => {
  let service: SettingHomeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SettingHomeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
