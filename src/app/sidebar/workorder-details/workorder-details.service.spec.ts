import { TestBed } from '@angular/core/testing';

import { WorkorderDetailsService } from './workorder-details.service';

describe('WorkorderDetailsService', () => {
  let service: WorkorderDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkorderDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
