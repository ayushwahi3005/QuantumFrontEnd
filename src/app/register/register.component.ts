import { Component } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { FormGroup,FormBuilder, Validators } from '@angular/forms';
import { RegisterService } from './register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent  {

  registerForm!:FormGroup;
  displayStyle="none";

  constructor(private auth:AuthService,private formBuilder:FormBuilder,private registerService:RegisterService){}
  errorMessage:String='';
  successMessage:String='';
  ngOnInit():void{
  this.registerForm=this.formBuilder.group({
    firstName:['',Validators.required],
    lastName:['',Validators.required],
    email:['',Validators.required],
    mobileNumber:['+1',Validators.required],
    companyName:['',Validators.required],
    password:['',Validators.required],
    cpassword:['',Validators.required]
  })

  }
  register(){
    
    this.errorMessage='';
    console.log(this.registerForm.value);
    this.registerService.register(this.registerForm.value).subscribe((data)=>{
      this.auth.register(this.registerForm.controls['email'].value,this.registerForm.controls['password'].value);
      const obj={
        "customerEmail":this.registerForm.controls['email'].value,
        "companyName":this.registerForm.controls['companyName'].value,

      }
      this.registerService.addCompanyInformation(obj).subscribe((data)=>{
        console.log("Company Data uploaded");
      },
      (err)=>{
        console.log(err);
      })
      this.registerForm.reset();
      this.successMessage="Successfully registered"
    },
    (err)=>{
      this.errorMessage="Internal Error"
      this.errorMessage=err.error.errorMessage;
      this.registerForm.reset();
      this.openPopup();
    },
    ()=>{
      
      if(this.errorMessage==''&&this.successMessage==''){
        console.log("Database Error");
      }
    })
    
  }
  openPopup(){
    
    this.displayStyle="block";
  }
  closePopup(){
    
    this.displayStyle="none";
  }
}
