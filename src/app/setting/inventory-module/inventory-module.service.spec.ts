import { TestBed } from '@angular/core/testing';

import { InventoryModuleService } from './inventory-module.service';

describe('InventoryModuleService', () => {
  let service: InventoryModuleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventoryModuleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
