import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from './users.service';
import { AuthService } from 'src/app/shared/auth.service';
import { User } from './user';
import {ViewEncapsulation} from '@angular/core';
import { AccountLockInfo } from './AccountLockInfo';
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {environment} from 'src/environments/environment'

import { FirebaseApp } from 'firebase/app';
import { ActivatedRoute } from '@angular/router';
import { RoleAndPermission } from './RoleAndPermission';
// import { FirebaseApp } from 'firebase/app';



@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  encapsulation: ViewEncapsulation.None,
  
  
})
export class UsersComponent {


  
  userForm!:FormGroup;
  editUserForm!:FormGroup;
  subscription!:any;
  email!:any;
  companyId!:any;
  // access!:boolean;
  userList!:User[];

  showAlert: boolean = false; // Flag to toggle alert visibility
  alertMessage: string = ''; // Alert message
  alertType: string = 'success'; // Alert type: success, warning, error, etc.
  selectedCar: any;
  registredUsers!:string[];
  registredUsersMap!:Map<String,Boolean>;
  isLoading!:boolean;
  accountLockInfo!:AccountLockInfo;
  lockedInfo!:Map<String,Boolean>
  selectDeleteUser!:string;
  app!:any
  roleAndPermissionList!:RoleAndPermission[];
  selectEditUser!:any;
  role!:any;
  detailedRole!:RoleAndPermission;

  constructor(private formBuilder:FormBuilder,private userService:UsersService,private authService:AuthService,private route:ActivatedRoute){}



  ngOnInit(){
    this.userList=[];
    this.email=localStorage.getItem('user');
    this.companyId=localStorage.getItem('companyId');
    this.role=localStorage.getItem('role')
    console.log("role->"+this.role)
    console.log("role=>"+(this.role!='ADMIN'))
    this.isLoading=false;
    this.userService.getRoleAndPermission(this.companyId).subscribe((data)=>{
      this.roleAndPermissionList=data;
      console.log(this.roleAndPermissionList)
    },
  err=>{
    console.log(err);
  });
  
      this.userService.getRoleAndPermissionByName(this.companyId,this.role).subscribe((data)=>{
        this.detailedRole=data;
      },
      (err)=>
      console.log(err)
    )
      

    this.userForm=this.formBuilder.group({
      
      firstName:['',Validators.required],
      lastName:['',Validators.required],
      jobTitle:[''],
      email:['',Validators.required],
      phoneNumber:[''],
      role:['',Validators.required]
    });
    this.editUserForm=this.formBuilder.group({
      
      firstName:['',Validators.required],
      lastName:['',Validators.required],
      jobTitle:[''],
      phoneNumber:[''],
      role:['',Validators.required]
    });
    this.registredUsersMap=new Map<String,Boolean>();
    this.lockedInfo=new Map<String,Boolean>();
    // this.access=false;
    this.userService.getRegisteredUsers(this.companyId).subscribe((data)=>{
      this.registredUsers=data;
      console.log(this.registredUsers);
      this.registredUsers.forEach((user)=>{
        this.registredUsersMap.set(user,true);
        this.userService.getAccountInfo(user).subscribe((data)=>{
          const myData=data as AccountLockInfo;
          this.lockedInfo.set(myData?.customerEmail,myData?.lockedStatus);


        })
      })
    },
    (err)=>{
      console.log(err);
    })
    
    this.userService.getUsers(this.companyId).subscribe((data)=>{
      this.userList=data;
      
    },
    (err)=>{
      console.log(err);
    })





   
    this.app = initializeApp(environment.firebaseConfig);
    const auth = getAuth(this.app);

    // Extract parameters from the URL
    this.route.queryParams.subscribe(params => {
      const mode = params['mode'];
      const actionCode = params['oobCode'];
      const continueUrl = params['continueUrl'];
      const lang = params['lang'] || 'en';

      // Handle the user management action
      // switch (mode) {
      //   case 'resetPassword':
      //     // Display reset password handler and UI.
      //     this.handleResetPassword(auth, actionCode, continueUrl, lang);
      //     break;
      //   case 'recoverEmail':
      //     // Display email recovery handler and UI.
      //     this.handleRecoverEmail(auth, actionCode, lang);
      //     break;
      //   case 'verifyEmail':
      //     // Display email verification handler and UI.
      //     this.handleVerifyEmail(auth, actionCode, continueUrl, lang);
      //     break;
      //   default:
      //     // Error: invalid mode.
      //     console.error('Invalid mode:', mode);
      // }
      console.log("//////////-------------->"+actionCode)
    });
   
  }

  showOption(){
    console.log(this.selectedCar)
  }



  addUser(){
    console.log(this.userForm.value);
    console.log(this.companyId)
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
      "role":this.userForm.controls['role'].value,
      "title":this.userForm.controls['jobTitle'].value
    }
    this.userService.registerUser(user).subscribe((data)=>{
      console.log("data saved");
      this.triggerAlert("Successfully Invited","success");
      this.ngOnInit();
    },
    (err)=>{
      console.log(err);
      this.triggerAlert(err.error.errorMessage,"danger");
    },
    ()=>{
      // this.userService.sendEmail(obj,this.companyId).subscribe((data)=>{
      //   console.log("email sent");
      //   this.ngOnInit();
      // },
      // (err)=>{
      //   console.log(err);
      // })
      this.sendMail(obj);
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
  resendMail(email:any){
   
    let myUser:User;
    this.userService.getUserDetails(this.companyId,email).subscribe((data)=>{
      this.isLoading=true;
      myUser=data;
      let obj={
        "firstName":myUser.firstName,
        "lastName":myUser.lastName,
        "email":email,
        "message":"Hello please go to link for registration: ",
        "role":myUser.role,
        "from":this.email
      }
      console.log(myUser);
      this.userService.sendEmail(obj,this.companyId).subscribe((data)=>{
        console.log("email sent");
        this.isLoading=false;
        this.triggerAlert("Successfully Invited","success");
        this.ngOnInit();
      },
      (err)=>{
        console.log(err);
        this.triggerAlert(err.error.errorMessage,"danger");
        this.isLoading=false;
      });
    })
   
    
  }
  sendMail(obj:any){
    this.userService.sendEmail(obj,this.companyId).subscribe((data)=>{
      console.log("email sent");
      this.ngOnInit();
    },
    (err)=>{
      console.log(err);
    })
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
  unlockAccount(email: string) {
  
    let myAccountData:AccountLockInfo;
    this.userService.getAccountInfo(email).subscribe((data)=>{
      this.isLoading=true;
      myAccountData=data as AccountLockInfo;
      let obj={
        "id":myAccountData.id,
        "customerEmail":email,
        "lockedStatus":false,
        "incorrectAttemptCount":0
      }
      this.userService.updateAccountInfo(obj).subscribe((data)=>{
        
        console.log("Account Unlocked");
      },
      (err)=>{
        console.log(err);
        this.isLoading=false;
      },
      ()=>{
       
        this.triggerAlert(email+" is now unlocked","success");
      })
    },
    (err)=>{
      this.triggerAlert(err,"danger");
    },
    ()=>{
      this.isLoading=false;
      this.ngOnInit();
    })
    
    }
    selectDeleteUserFunc(email:string){
      this.selectDeleteUser=email;
    }
    selectEditUserFunc(email:string){
      this.userService.getUserDetails(this.companyId,email).subscribe((data)=>{
        this.selectEditUser=data as User;
        
        console.log(this.selectEditUser)
      },
      (err)=>{
        console.log(err);
      })
     
    }
    updateUser(){
      let obj={
        "firstName":this.editUserForm.controls['firstName'].value,
        "lastName":this.editUserForm.controls['lastName'].value,
        "email":this.selectEditUser.email,
        "companyId":this.companyId,
        "mobileNumber":this.editUserForm.controls['phoneNumber'].value,
        "role":this.editUserForm.controls['role'].value,
        "title":this.editUserForm.controls['jobTitle'].value
      }
      this.userService.updaterUser(obj).subscribe((data)=>{
       console.log("User Updated")
      },
      (err)=>{
        console.log(err);
        this.selectEditUser=null;
      },
      ()=>{
        this.selectEditUser=null;
        this.ngOnInit()
      })
    }
    deleteUser() {

      this.userService.deleteUser(this.companyId,this.selectDeleteUser).subscribe((data)=>{
        this.isLoading=true;
       
        this.userService.deleteCustomer(this.companyId,this.selectDeleteUser).subscribe((data)=>{
          
        },
        (err)=>{
          console.log(err);
       
        },
        ()=>{
          console.log("User deleted Sucessfully");
          this.ngOnInit();
      });
      },
      (err)=>{
        console.log(err.error.errorMessage);
        this.triggerAlert(err.error.errorMessage,"danger");
        this.isLoading=false;
      },
      ()=>{
        console.log("Deleted Sucessfully");
        this.selectDeleteUser='';
        this.isLoading=false;
        this.ngOnInit();
        this.triggerAlert("User Deleted !!","success");
      })
      }

}
