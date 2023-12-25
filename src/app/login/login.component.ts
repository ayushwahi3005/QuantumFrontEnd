import { Component, NgZone, ViewChild } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email:string='';
  password:string='';


  constructor(private auth:AuthService,private _ngZone: NgZone){}

  ngOnInit():void{

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
  }
  firstNameAutofilled!: boolean;
  lastNameAutofilled!: boolean;
  
}
