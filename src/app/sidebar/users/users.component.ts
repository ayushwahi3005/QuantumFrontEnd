import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from './users.service';
import { AuthService } from 'src/app/shared/auth.service';
import { User } from './user';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  
  userForm!:FormGroup;
  subscription!:any;
  email!:any;
  companyId!:any;
  access!:boolean;
  userList!:User[];
  constructor(private formBuilder:FormBuilder,private userService:UsersService,private authService:AuthService){}

  ngOnInit(){
    this.email=localStorage.getItem('user');
    this.companyId=localStorage.getItem('companyId');
    this.userForm=this.formBuilder.group({
      
      firstName:['',Validators.required],
      lastName:['',Validators.required],
      jobTitle:['',Validators.required],
      email:['',Validators.required],
      phoneNumber:['',Validators.required],
      role:['viewOnly']
    })
    this.access=false;
    this.userService.getUsers(this.companyId).subscribe((data)=>{
      this.userList=data;
      console.log("-----------------------------------------"+this.userList[0])
    },
    (err)=>{
      console.log(err);
    })
  }
  addUser(){
    console.log(this.userForm.value);
    let obj={
      "firstName":this.userForm.controls['firstName'].value,
      "lastName":this.userForm.controls['lastName'].value,
      "email":this.userForm.controls['email'].value,
      "message":"Hello please go to link for registration: ",
      "role":this.userForm.controls['role'].value,
      "from":this.email
    }
    this.userService.sendEmail(obj,this.companyId).subscribe((data)=>{
      console.log("email sent");
    },
    (err)=>{
      console.log(err);
    })
    // console.log("-------->",this.userForm.controls['usertype'].value)
    // console.log("-------->",this.userForm.controls['email'].value)
    // console.log("-------->",this.authService.getEmail())
    // if(this.userForm.controls['usertype'].value!='viewonly'){
    //     this.userService.checkSubscription(this.email).subscribe((data)=>{
    //       this.subscription=data;
    //       console.log(this.subscription);
    //       alert("Added User Successfully!!")
         
    //     },
    //     (err)=>{
          
    //       console.log(err.error.errorMessage);
    //       alert(err.error.errorMessage+". Please Subscribe!!")
    //     })
    // }
    // else{
    //   console.log("viewonly activated");
    //   alert("Added User Successfully!!")
    // }

    
  }
  changeAccess(data:any){
    // this.access=data;
    console.log(data.checked);
    this.access=data.checked;
  }


}
