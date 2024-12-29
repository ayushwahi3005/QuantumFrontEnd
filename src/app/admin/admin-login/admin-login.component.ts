import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminLoginService } from './admin-login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-login',

  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent {
  email: string = '';
  password: string = '';

  constructor(private adminService:AdminLoginService,private router:Router) { }
  onSubmit() {
    if (this.email && this.password) {
      console.log('Email:', this.email);
      console.log('Password:', this.password);
      // You can implement actual authentication logic here
      const obj={
        "email":this.email,
        "password":this.password
      }
      this.adminService.login(obj).subscribe((data)=>{
        console.log("Login Successful");
        // console.log(data)
        localStorage.setItem('authToken',data.token);
        // console.log(localStorage.getItem("authToken"))
        this.router.navigate(['admin/home']);
      },
    (err)=>{
      console.log("Login Failed");
      console.log(err);

    })
    } else {
      console.log('Please fill out the form.');
    }
  }
}
