import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerResetPasswordComponent } from './customer-reset-password.component';

describe('CustomerResetPasswordComponent', () => {
  let component: CustomerResetPasswordComponent;
  let fixture: ComponentFixture<CustomerResetPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerResetPasswordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomerResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
