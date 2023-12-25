import { TestBed } from '@angular/core/testing';

import { EditInventoryService } from './edit-inventory.service';

describe('EditInventoryService', () => {
  let service: EditInventoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditInventoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
