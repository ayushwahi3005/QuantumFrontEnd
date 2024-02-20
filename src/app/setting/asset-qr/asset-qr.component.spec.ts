import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetQRComponent } from './asset-qr.component';

describe('AssetQRComponent', () => {
  let component: AssetQRComponent;
  let fixture: ComponentFixture<AssetQRComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssetQRComponent]
    });
    fixture = TestBed.createComponent(AssetQRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
