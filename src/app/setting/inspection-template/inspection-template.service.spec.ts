import { TestBed } from '@angular/core/testing';

import { InspectionTemplateService } from './inspection-template.service';

describe('InspectionTemplateService', () => {
  let service: InspectionTemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InspectionTemplateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
