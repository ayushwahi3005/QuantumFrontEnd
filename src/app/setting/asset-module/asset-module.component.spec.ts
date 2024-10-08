import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetModuleComponent } from './asset-module.component';

describe('AssetModuleComponent', () => {
  let component: AssetModuleComponent;
  let fixture: ComponentFixture<AssetModuleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssetModuleComponent]
    });
    fixture = TestBed.createComponent(AssetModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
