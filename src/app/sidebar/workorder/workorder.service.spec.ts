import { TestBed } from '@angular/core/testing';

import { WorkOrderService } from './workorder.service';

describe('WorkorderService', () => {
  let service: WorkOrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkOrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
