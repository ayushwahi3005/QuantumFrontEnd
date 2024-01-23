import { Component, NgZone, ViewChild } from '@angular/core';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email:string='';
  password:string='';
  errorMessage:string='';


  constructor(private auth:AuthService,private authService:AuthService){}

  ngOnInit():void{
    console.log("--------------AuthTokenIn------------------"+localStorage.getItem('authToken'));
    console.log("--------------------------"+localStorage.getItem('companyId'));
  }
  login(){
    if(this.email==''){
      alert('Please enter email');
      return;
    }
    if(this.password==''){
      alert('Please enter password');
      return;
    }
    this.auth.login(this.email,this.password);
    this.email='';
    this.password='';
    this.errorMessage=this.authService.getErrorMessage();
    console.log(this.errorMessage+"in Login")
  }
  firstNameAutofilled!: boolean;
  lastNameAutofilled!: boolean;
  
}
