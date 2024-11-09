import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportHistoryComponent } from './import-history.component';

describe('ImportHistoryComponent', () => {
  let component: ImportHistoryComponent;
  let fixture: ComponentFixture<ImportHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImportHistoryComponent]
    });
    fixture = TestBed.createComponent(ImportHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
