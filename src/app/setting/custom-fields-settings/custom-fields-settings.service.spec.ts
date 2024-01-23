import { TestBed } from '@angular/core/testing';

import { CustomFieldsSettingsService } from './custom-fields-settings.service';

describe('CustomFieldsSettingsService', () => {
  let service: CustomFieldsSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomFieldsSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
