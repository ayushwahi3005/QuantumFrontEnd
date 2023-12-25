import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingHomeComponent } from './setting-home.component';

describe('SettingHomeComponent', () => {
  let component: SettingHomeComponent;
  let fixture: ComponentFixture<SettingHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SettingHomeComponent]
    });
    fixture = TestBed.createComponent(SettingHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
