import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from './users.service';
import { AuthService } from 'src/app/shared/auth.service';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  
  userForm!:FormGroup;
  subscription!:any;
  email!:any;
  constructor(private formBuilder:FormBuilder,private userService:UsersService,private authService:AuthService){}

  ngOnInit(){
    this.userForm=this.formBuilder.group({
      
      usertype:['',Validators.required],
      email:['',Validators.required]
    })
  }
  addUser(){
    this.email=localStorage.getItem('user');
    console.log("-------->",this.userForm.controls['usertype'].value)
    console.log("-------->",this.userForm.controls['email'].value)
    console.log("-------->",this.authService.getEmail())
    if(this.userForm.controls['usertype'].value!='viewonly'){
        this.userService.checkSubscription(this.email).subscribe((data)=>{
          this.subscription=data;
          console.log(this.subscription);
          alert("Added User Successfully!!")
         
        },
        (err)=>{
          
          console.log(err.error.errorMessage);
          alert(err.error.errorMessage+". Please Subscribe!!")
        })
    }
    else{
      console.log("viewonly activated");
      alert("Added User Successfully!!")
    }

    
  }


}
