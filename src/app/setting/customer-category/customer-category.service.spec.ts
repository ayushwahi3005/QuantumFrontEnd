import { TestBed } from '@angular/core/testing';

import { CustomerCategoryService } from './customer-category.service';

describe('CustomerCategoryService', () => {
  let service: CustomerCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
