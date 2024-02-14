import { TestBed } from '@angular/core/testing';

import { WorkorderModuleService } from './workorder-module.service';

describe('WorkorderModuleService', () => {
  let service: WorkorderModuleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkorderModuleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
