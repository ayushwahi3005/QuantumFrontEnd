import { TestBed } from '@angular/core/testing';

import { ImportHistoryService } from './import-history.service';

describe('ImportHistoryService', () => {
  let service: ImportHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImportHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
