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
import { MandatoryFields } from '../assets/mandatoryFields';
import { ShowFieldsData } from '../assets/showFieldsData';
import { ExtraFieldName } from '../assets/extraFieldName';
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
  selectedExtraColums :string[]=[];
  savedExtraColumn!:any
  selectedExtraColumsMap!:Map<string,Boolean>;
  mandatoryFieldsList!:MandatoryFields[];
  showFieldsList!:ShowFieldsData[];
  mandatoryFieldsMap!:Map<string,boolean>;
  showFieldsMap!:Map<string,boolean>;
  selectedFilterList:any=[];
  filterList:any=[];
  extraFieldFilterList!:Map<String,String>;
  extraFieldName!:ExtraFieldName[];
  extraFieldNameMap!:Map<String,ExtraFieldName>;
  extraFieldNameList!:string[];
  checkBoxColor="primary"
  showMandatoryBasicFields!:Map<string,Boolean>;
  myList:string[]=[];
  myArray=[]
  mandatoryFieldFilterList!:Map<string,Boolean>;
  searchedUser!:any[];
  constructor(private formBuilder:FormBuilder,private userService:UsersService,private authService:AuthService,private route:ActivatedRoute){}



  ngOnInit(){
    this.userList=[];
    this.email=localStorage.getItem('user');
    this.companyId=localStorage.getItem('companyId');
    this.role=localStorage.getItem('role')
    console.log("role->"+this.role)
    console.log("role=>"+(this.role!='ADMIN'))
    this.isLoading=false;
    this.showMandatoryBasicFields=new Map<string,Boolean>();
    this.mandatoryFieldFilterList=new Map<string,Boolean>();
    this.extraFieldFilterList=new Map<String,String>();
    this.showFieldsMap=new Map<string,boolean>();
    this.savedExtraColumn=localStorage.getItem("selectedExtraColumsUsers")
    this.savedExtraColumn=localStorage.getItem("showMandatoryBasicFieldsAssets")
    this.myArray=JSON.parse(this.savedExtraColumn)
    console.log("MYARRAY"+this.myArray)
    this.mandatoryFieldsMap = new Map<string, boolean>();
    this.myList=['name','title','email','role','status'];
    this.showMandatoryBasicFields.set('image',true);
    this.showMandatoryBasicFields.set('assetId',true);
    this.showMandatoryBasicFields.set('name',true);
    this.myList.forEach((x)=>{
      if(this.myArray!=null){
        this.myArray.forEach((ele:any)=>{
          if(x===ele){
            this.showMandatoryBasicFields.set(x,true);
          }
        })
     }
     else{
      this.showMandatoryBasicFields.set(x,true);
     }
      // if()
      
      this.mandatoryFieldFilterList.set(x,true);
    });
    this.selectedExtraColumsMap = new Map();
    if(this.savedExtraColumn!=null){
      this.selectedExtraColums=JSON.parse(this.savedExtraColumn);
      
      this.selectedExtraColums.forEach((data)=>{
        this.selectedExtraColumsMap.set(data,true);
      })
    }
    // this.selectedExtraColumsMap.forEach((ele,val)=>{
    //   console.log(ele+"----"+val)
    // })
    this.userService.getRoleAndPermission(this.companyId).subscribe((data)=>{
      this.roleAndPermissionList=data;
      this.roleAndPermissionList = this.roleAndPermissionList.map((item: any) => ({
        ...item,
        _id: item.id
      }));
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
      id:[''],
      firstName:['',Validators.required],
      lastName:['',Validators.required],
      status: [''],
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
      console.log(this.userList);
      this.searchedUser=this.userList;
      
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

    this.userService.getAllMandatoryFields(this.companyId).subscribe((data)=>{
      this.mandatoryFieldsList=data;
      console.log("mandatory----------------------->",this.mandatoryFieldsList)
      if(this.mandatoryFieldsList.length>0){
      this.mandatoryFieldsList?.forEach((x)=>{
        console.log(x.name+" "+x.mandatory)
        this.mandatoryFieldsMap.set(x.name,x.mandatory);
      })
    }
    },
    (err)=>{
      console.log(err);
    })
    this.userService.getAllShowFields(this.companyId).subscribe((data)=>{
      this.showFieldsList=data;
      console.log("show----------------------->",this.showFieldsList)
      this.selectedFilterList=[]
      if(this.showFieldsList.length>0){
      this.showFieldsList?.forEach((x)=>{
        this.filterList.push(x.name);
        this.selectedFilterList.push(x.name);
        // this.filterForm.addControl(x.name,this.formBuilder.control('',Validators.required));
        this.showFieldsMap.set(x.name,x.show);
        if(x.show==true){
          this.extraFieldFilterList.set(x.name,x.type);
        }
      })
    }
      
      if(this.showFieldsList!=null){
        if(this.showFieldsList.length>0){
      this.showFieldsList.forEach((x)=>{
        if(x.show==true)
        this.userForm.addControl(x.name,this.formBuilder.control(''));
      })
    }
    }
    
    },
    (err)=>{
      console.log(err);
    },
    ()=>{
      this.userService.getExtraFieldName(this.companyId).subscribe((data)=>{
      
     
        this.extraFieldName=data;
        let arr:string[]=[];
      this.extraFieldName.forEach((x)=>{
      
        console.log(x.name+" "+this.showFieldsMap.get(x.name))
        this.extraFieldNameMap?.set(x.name,x);
          if(this.showFieldsMap.get(x.name)==true){
          arr.push(x.name);
          }
        })
     
        this.extraFieldNameList=arr;
        console.log(this.extraFieldNameList)
        
     
       
        
        
      },
      (err)=>{
        console.log(err);
      })
    })

   
  }

  showOption(){
    console.log(this.selectedCar)
  }



  addUser(){
    console.log(this.userForm.value);
    console.log(this.companyId)
    console.log(this.userForm.value)
    //   this.showFieldsList?.forEach((x) => {
    //   if (x.show == true) {
    //     extraFieldValueMap.set(x.name, this.assetForm.get(x.name)?.value);
    //     extraFieldTypeMap.set(x.name, this.assetForm.get(x.type)?.value);
    //   }
    // })
    let valid=1;
    this.mandatoryFieldsList.forEach((field)=>{
      if(this.userForm.controls[field.name].value==''||this.userForm.controls[field.name].value==null){
        console.log("Issueeeee");
        let myField=field.name;
        if(myField==='jobTitle'){
          myField='Job Title';
        }
        else if(myField==='phoneNumber'){
          myField='Phone';
        }
        else{
          myField=myField.charAt(0).toUpperCase()+myField.slice(1);
        }
        this.triggerAlert(myField+" is mandatory","danger");
        valid=0;
        return;
      }
    })
    if(valid==0){
      return;
    }
    let role=this.roleAndPermissionList.filter((x)=> x.id==this.userForm.controls['role'].value).at(0);
    let obj={
      "firstName":this.userForm.controls['firstName'].value,
      "lastName":this.userForm.controls['lastName'].value,
      "email":this.userForm.controls['email'].value,
      "message":"Hello please go to link for registration: ",
      "role":role?.name,
      "from":this.email
    }
    console.log(this.userForm.controls['role'].value)
   
    let user={
      "firstName":this.userForm.controls['firstName'].value,
      "lastName":this.userForm.controls['lastName'].value,
      "email":this.userForm.controls['email'].value,
      "companyId":this.companyId,
      "mobileNumber":this.userForm.controls['phoneNumber'].value,
      "role":role,
      "title":this.userForm.controls['jobTitle'].value
    }
    console.log(user)
    let savedUser:User;
    this.userService.registerUser(user).subscribe((data)=>{
      console.log("data saved");
      savedUser=data as User;
      console.log(savedUser)
      this.triggerAlert("Successfully Invited","success");
             this.showFieldsList?.forEach((x) => {
          const obj = {
            "email": this.email,
            "companyId": this.companyId,
            "name": x.name,
            "value": this.userForm.controls[x.name].value,
            "userId": savedUser.id,
            "type":x.type
          }
          console.log("extra fields obj" + obj.companyId + " " + obj.name + " " + obj.value + " assetId " + obj.userId)
          this.userService.addExtraFields(obj).subscribe((data) => {
            console.log("added extra fields");
          },
            (err) => {
              console.log(err);
              this.triggerAlert(err.error.errorMessage, "danger");
            })
        })
      this.ngOnInit();
    },
    (err)=>{
      console.log(err);
      if(err.error.errorMessage==="No active subscription. Please subscribe to a Plan"){
        this.triggerAlert("Want to add more users? Subscribe to a plan to unlock this feature.","danger");
      }
       else if(err.error.error==="TRIAL_EXPIRED"){
        this.triggerAlert(err.error.message,"danger");
      }
      else{
      this.triggerAlert(err.error.errorMessage,"danger");
      }
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
  resendEmailVerificationLink(email:any){
    this.userService.resendFirebaseVerificationEmail(this.companyId,email).subscribe((data)=>{
      console.log(data);
      this.triggerAlert(data.message,data.status);
    },
    (err)=>{
      console.log(err);
      this.triggerAlert(err.error.errorMessage,"danger");
    })
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
      console.log(obj);
      this.userService.sendEmail(obj,this.companyId).subscribe((data)=>{
        console.log("email sent");
        this.isLoading=false;
        this.triggerAlert("Successfully Invited","success");
        this.ngOnInit();
      },
      (err)=>{
        console.log(err);
         if(err.error.error==="TRIAL_EXPIRED"){
        this.triggerAlert(err.error.message,"danger");
      }
      else{
      this.triggerAlert(err.error.errorMessage,"danger");
      }
        this.isLoading=false;
      });
    })
   
    
  }
  sendMail(obj:any){
    console.log(obj)
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
    updateRoleChange(selectedMongoId:any){
      const selectedRole = this.roleAndPermissionList.find(role => role._id === selectedMongoId);
    if (selectedRole) {
      console.log('role.id:', selectedRole.id);
    }
    

      console.log(selectedMongoId)
      // console.log(data.target.value)
    }
    updateUser(){
      console.log(this.editUserForm.controls['role'].value)
      let role=this.roleAndPermissionList.filter((x)=> x.id==this.editUserForm.controls['role'].value).at(0);
      console.log(role)
      let obj={
        "id":this.selectEditUser.id,
        "firstName":this.editUserForm.controls['firstName'].value,
        "lastName":this.editUserForm.controls['lastName'].value,
        "email":this.selectEditUser.email,
        "companyId":this.companyId,
        "mobileNumber":this.editUserForm.controls['phoneNumber'].value,
        "role":role,
        "title":this.editUserForm.controls['jobTitle'].value,
        "status":this.editUserForm.controls['status'].value
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
         if(err.error.error==="TRIAL_EXPIRED"){
        this.triggerAlert(err.error.message,"danger");
      }
      else{
      this.triggerAlert(err.error.errorMessage,"danger");
      }
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

      onChange(value: string): void {
        if (this.selectedExtraColums.includes(value)) {
          this.selectedExtraColums = this.selectedExtraColums.filter((item) => item !== value);
        } else {
          this.selectedExtraColums.push(value);
        }
        console.log(this.selectedExtraColums)
        this.selectedExtraColums.sort();
    
      }
      customCheckBox(isChecked:any,item:string){
        console.log(isChecked);
       
        if(isChecked){
          this.selectedExtraColums.push(item);
          this.selectedExtraColumsMap.set(item,true);
        }
        else{
          this.selectedExtraColums=this.selectedExtraColums.filter((data)=> data!=item);
          this.selectedExtraColumsMap?.set(item,false);
        }
         localStorage.setItem("selectedExtraColumsAssets",  JSON.stringify(this.selectedExtraColums));
        console.log(this.selectedExtraColums);
      }

      mandatoryFieldCheckBox(isChecked:any,item:string){
     
        if(isChecked){
          this.showMandatoryBasicFields.set(item,true);
        }
        else{
          this.showMandatoryBasicFields.set(item,false);
        }
        const myArry:any=[];
        this.showMandatoryBasicFields.forEach((val,ele)=>{
          if(val==true){
          myArry.push(ele)
          }
        })
        // console.log(JSON.stringify(Object.fromEntries(this.showMandatoryBasicFields)));
        localStorage.setItem("showMandatoryBasicFieldsAssets",  JSON.stringify(myArry));
        console.log(item+" mandatory-"+localStorage.getItem("showMandatoryBasicFieldsAssets"));
      }

      find(data:any){
        console.log(data.target.value)
     
        const value=data.target.value;
       
        this.searchedUser=this.userList.filter((mydata)=>{
      //  console.log(mydata)
          let filterData:any;
           //  console.log(mydata)
          if(mydata.firstName.toLowerCase().includes(value.toLowerCase())||mydata.lastName.toLowerCase().includes(value.toLowerCase())||mydata.mobileNumber.toLowerCase().includes(value.toLowerCase())||(mydata.role.name.toLowerCase()?.includes(value.toLowerCase()))||(mydata.title.toLowerCase().includes(value.toLowerCase()))||(mydata.email.toLowerCase().includes(value.toLowerCase()))){
            filterData=mydata;
          }
          else{
            filterData=false;
          }
          console.log(filterData)
          return filterData;
         
          // keys.forEach((key)=>{
          //   const myString:String =data[key];
          //   if(myString!=null&&myString.toLowerCase().includes(value.toLowerCase())){
          //     filterData=data;
          //   }
           
            
            
          // })
          // return filterData;
        });
      }
      makeInActive(data:any){
        data.status="inActive";
        this.userService.updateStatus(data).subscribe((data)=>{
          console.log(data);
          this.triggerAlert(data,"success");
        }
        ,(err)=>{
        console.log(err);
        })

      }
      makeActive(data:any){
        data.status="active";
        this.userService.updateStatus(data).subscribe((data)=>{
          this.triggerAlert(data,"success");
          console.log(data);
        }
        ,(err)=>{
        console.log(err);
        let errorMsg = 'Something went wrong!';

        if (err && err.error) {
          try {
            const parsedError = typeof err.error === 'string' ? JSON.parse(err.error) : err.error;
            errorMsg = parsedError.errorMessage || errorMsg;
          } catch (e) {
            console.error('Error parsing backend response:', e);
          }
        }

        this.triggerAlert(errorMsg, 'danger');

        data.status="inActive";
        })

      }

}
