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

  showAlert: boolean = false; // Flag to toggle alert visibility
  alertMessage: string = ''; // Alert message
  alertType: string = 'success'; // Alert type: success, warning, error, etc.

  

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
    let user={
      "firstName":this.userForm.controls['firstName'].value,
      "lastName":this.userForm.controls['lastName'].value,
      "email":this.userForm.controls['email'].value,
      "companyId":this.companyId,
      "mobileNumber":this.userForm.controls['phoneNumber'].value,
      "role":this.userForm.controls['role'].value
    }
    this.userService.registerUser(user).subscribe((data)=>{
      console.log("data saved");
      this.triggerAlert("Successfully Invited","success");
    },
    (err)=>{
      console.log(err);
      this.triggerAlert(err.error.errorMessage,"danger");
    },
    ()=>{
      this.userService.sendEmail(obj,this.companyId).subscribe((data)=>{
        console.log("email sent");
        
      },
      (err)=>{
        console.log(err);
      })
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
  triggerAlert(message: string, type: string) {
    console.log("triiger")
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;
    // You can set a timeout to automatically hide the alert after a certain time
    setTimeout(() => {
      this.showAlert = false;
    }, 5000); // Hide the alert after 5 seconds (adjust as needed)
  }

}
