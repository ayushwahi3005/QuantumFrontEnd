import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ResetPasswordAdminService } from './reset-password-admin.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reset-password-admin',
  templateUrl: './reset-password-admin.component.html',
  styleUrl: './reset-password-admin.component.css'
})
export class ResetPasswordAdminComponent  {

  email: string = '';
  otp: string = '';
  newPassword: string = '';
  newCpassword: string = '';
  otpSent: boolean = false;
  otpValidated: boolean = false;
  errorMessage: string = '';
  loading:boolean=false;
  showAlert: boolean = false; // Flag to toggle alert visibility
  alertMessage: string = ''; // Alert message
  alertType: string = 'success'; 

  constructor(private resetPasswordAdmin: ResetPasswordAdminService, private router: Router) {}
  ngOnInit(){
    this.otpSent=false
    console.log(this.otpSent)
  }
  print(){
    console.log(this.email)
  }
  sendOtp() {
    this.loading=true;
    console.log(this.email)
    if (this.email) {
      this.resetPasswordAdmin.sendOtp(this.email).subscribe(
        response => {
          console.log(response)
          this.otpSent = true;
          this.errorMessage = '';
          this.loading=false;;
        },
        error => {
          this.loading=false;
          console.log(JSON.parse(error.error).errorMessage)
          console.log(error.error.errorMessage)
          // this.errorMessage = 'Error sending OTP. Please try again.';
          this.errorMessage=JSON.parse(error.error).errorMessage;
        }
      );
    } else {
      this.loading=false;
      this.errorMessage = 'Please enter a valid email address.';
    }
  }

  validateOtp() {
    this.loading=true;
    if (this.otp) {
      this.resetPasswordAdmin.validateOtp(this.email, this.otp).subscribe(
        isValid => {
          if (isValid) {
            this.otpValidated = true;
            this.errorMessage = '';
            
          } else {
            this.errorMessage = 'Invalid OTP. Please try again.';
          }
          this.loading=false;
        },
        error => {
          this.loading=false;
          this.errorMessage = 'Error validating OTP. Please try again.';
        }
      );
    } else {
      this.loading=false;
      this.errorMessage = 'Please enter the OTP.';
    }
  }

  resetPassword() {
    if(this.newCpassword!=this.newCpassword){
      this.errorMessage = 'Password does not match with the confirm password. Please try again.';
      return;
    }
    this.loading=true;
    if (this.newPassword) {
      // Call backend to reset password
      
      this.resetPasswordAdmin.resetPassword(this.email, this.newPassword).subscribe(
        response => {
          // alert('Password updated successfully');
          this.loading=false;
          this.triggerAlert('Password updated successfully', 'success');
          
        },
        error => {
          this.loading=false;
          this.errorMessage = 'Error resetting password. Please try again.';
        }
      );
    } else {
      this.loading=false;
      this.errorMessage = 'Please enter a new password.';
    }
  }

  triggerAlert(message: string, type: string) {
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;
    // You can set a timeout to automatically hide the alert after a certain time
    setTimeout(() => {
      this.showAlert = false;
      this.router.navigate(['/login']);
    }, 5000); // Hide the alert after 5 seconds (adjust as needed)
  }
}
