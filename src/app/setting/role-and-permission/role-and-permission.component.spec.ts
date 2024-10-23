import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleAndPermissionComponent } from './role-and-permission.component';

describe('RoleAndPermissionComponent', () => {
  let component: RoleAndPermissionComponent;
  let fixture: ComponentFixture<RoleAndPermissionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RoleAndPermissionComponent]
    });
    fixture = TestBed.createComponent(RoleAndPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
