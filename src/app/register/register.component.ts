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


  ngOnInit():void{
  this.registerForm=this.formBuilder.group({
    firstName:['',Validators.required],
    lastName:['',Validators.required],
    email:['',Validators.required],
    mobileNumber:['+1',Validators.required],
    companyName:['',Validators.required],
    password:['',Validators.required],
    cpassword:['',Validators.required],
    companyId:['']
  })
  this.subscribeToService();

  }

  triggerAlert(message: string, type: string) {
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;
    // You can set a timeout to automatically hide the alert after a certain time
    console.log("alert trigger register"+message+" "+type)
    setTimeout(() => {
      this.showAlert = false;
      this.router.navigate(['/login']);
    }, 5000); // Hide the alert after 5 seconds (adjust as needed)
  }
  register(){
    
    this.errorMessage='';
    console.log(this.registerForm.value);
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
      "customerEmail":this.registerForm.controls['email'].value,
      "companyName":this.registerForm.controls['companyName'].value,

    }
    this.registerService.addCompanyInformation(obj).subscribe((data)=>{
      console.log("Company Data uploaded");
      this.companyInformation=data;
      console.log(this.companyInformation);
      this.registerForm.get('companyId')?.setValue(this.companyInformation.id);
      this.registerService.register(this.registerForm.value).subscribe((data)=>{
        this.auth.register(this.registerForm.controls['email'].value,this.registerForm.controls['password'].value);
        
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
      console.log("trigger register in service vallleeddd2222")
      this.triggerAlert(mydata.data,mydata.type); // Call your component function here
    });
  }
}
