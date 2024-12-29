import { Component } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { FormGroup,FormBuilder, Validators } from '@angular/forms';
import { RegisterService } from './register.service';
import { CompanyInformation } from './companyInformation';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent  {

  registerForm!:FormGroup;
  displayStyle="none";
  companyInformation!:CompanyInformation;

  constructor(private auth:AuthService,private formBuilder:FormBuilder,private registerService:RegisterService,private router:Router){}
  errorMessage:String='';
  successMessage:String='';

  showAlert: boolean = false; // Flag to toggle alert visibility
  alertMessage: string = ''; // Alert message
  alertType: string = 'success'; // Alert type: success, warning, error, etc.
  firstName!:'';
  lastName!:'';
  email!:'';
  mobileNumber!:'+1';
  companyName!:'';
  password!:'';
  cpassword!:'';
  companyId!:''
  registerObj:any;

  ngOnInit():void{
  this.registerForm=this.formBuilder.group({
    firstName:[''],
    lastName:[''],
    email:[''],
    mobileNumber:['+1'],
    companyName:[''],
    password:[''],
    cpassword:[''],
    companyId:['']
  })
  this.subscribeToService();

  this.registerObj={
    "firstName":'',
  "lastName":'',
  "email":'',
  "mobileNumber":'+1',
  "companyName":'',
  "password":'',
  "cpassword":'',
  "companyId":''
  }

  }

  triggerAlert(message: string, type: string) {
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;
    // You can set a timeout to automatically hide the alert after a certain time
    console.log("alert trigger register"+message+" "+type)
    
   
    setTimeout(() => {
      this.showAlert = false;
      if(type=="success"){ this.router.navigate(['/login']);}
    }, 5000);
     // Hide the alert after 5 seconds (adjust as needed)
  }
  register(){
    
    let flag = 0;

    // console.log(this.registerForm.value)
    

    

    for (const property of Object.keys(this.registerObj)) {
      // console.log(property)
      // const control = this.registerForm.get(controlName);
      if (this.registerObj[property]) {
        // Trim the value and set it back to the control
        // control.setValue(control.value.trim());
        this.registerObj[property]=this.registerObj[property].trim();
      }
      // console.log(controlName+" "+control?.value.length)
      if(property=="mobileNumber"&&this.registerObj[property].length!=12){ 
        this.triggerAlert("Enter Valid Mobile Number", "warning");
        flag = 1;
        break;
      }
      if(property=="password"&&this.registerObj[property].length<10){ 
        this.triggerAlert("Enter Password Minumim of Length 10", "warning");
        flag = 1;
        break;
      }
      
      else if (property!="companyId"&&(this.registerObj[property] == null || this.registerObj[property] === '')) {
        if(property.trim()==="cpassword"){ 
           this.triggerAlert("Empty Confirm Password", "warning");
          }
        else this.triggerAlert("Enter " + property, "warning");
        flag = 1;
        break; // Exit the loop when a control with an empty value is found
      }
    }
    if(!flag&&this.registerObj['password']!=this.registerObj['cpassword']){
      // console.log()
      this.triggerAlert("Password and Confirm Password does not match ", "warning");
      flag = 1;
      
    }
    if(flag==1) return;
    this.errorMessage='';
    // console.log(this.registerForm.value);

    // this.registerService.register(this.registerForm.value).subscribe((data)=>{
      
    //   this.auth.register(this.registerForm.controls['email'].value,this.registerForm.controls['password'].value);
    //   const obj={
    //     "customerEmail":this.registerForm.controls['email'].value,
    //     "companyName":this.registerForm.controls['companyName'].value,

    //   }
    //   this.registerService.addCompanyInformation(obj).subscribe((data)=>{
    //     console.log("Company Data uploaded");
    //   },
    //   (err)=>{
    //     console.log(err);
    //   })
    //   this.registerForm.reset();
    //   this.successMessage="Successfully registered";
    // },
    // (err)=>{
    //   this.errorMessage="Internal Error"
    //   this.errorMessage=err.error.errorMessage;
    //   this.registerForm.reset();
    //   this.openPopup();
    // },
    // ()=>{
      
    //   if(this.errorMessage==''&&this.successMessage==''){
    //     console.log("Database Error");
    //   }
    // })



    const obj={
      "customerEmail":this.registerObj['email'],
      "companyName":this.registerObj['companyName'],

    }
    this.registerService.addCompanyInformation(obj).subscribe((data)=>{
      console.log("Company Data uploaded");
      this.companyInformation=data;
      console.log(this.companyInformation);
      this.registerObj['companyId']=this.companyInformation.id;
      // this.registerForm.get('companyId')?.setValue(this.companyInformation.id);
      this.registerService.register(this.registerObj).subscribe((data)=>{
        this.auth.register(this.registerObj['email'],this.registerObj['password']);
        
        // this.registerForm.reset();
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
    },
    (err)=>{
      console.log(err);
    })
    
  
    
  }
  openPopup(){
    
    this.displayStyle="block";
  }
  closePopup(){
    
    this.displayStyle="none";
  }

  subscribeToService() {
    this.registerService.getTriggerFunctionSubjectRegister().subscribe((mydata:any) => {
      // console.log("trigger register in service vallleeddd2222")
      this.triggerAlert(mydata.data,mydata.type); // Call your component function here
    });
  }
}
