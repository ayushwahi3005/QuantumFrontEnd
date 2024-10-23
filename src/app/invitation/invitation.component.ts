import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InvitationService } from './invitation.service';
import { User } from './user';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-invitation',
  templateUrl: './invitation.component.html',
  styleUrls: ['./invitation.component.css']
})
export class InvitationComponent {
 constructor(private activeRoute:ActivatedRoute,private formBuilder:FormBuilder,private invitaionService:InvitationService,private authService:AuthService,private router:Router){}
 inviteForm!:FormGroup;
 companyId!:any;
 token!:any;
 user!:User;

 showAlert: boolean = false; // Flag to toggle alert visibility
  alertMessage: string = ''; // Alert message
  alertType: string = 'success'; // Alert type: success, warning, error, etc.
  checkAccount:any;

 ngOnInit(){
  this.activeRoute.paramMap.subscribe((data)=>{
    // this.workOrderId=data.get('id');
    console.log("invite-------------->"+data.get('id'))
    this.companyId=data.get('id');
  })

  this.activeRoute.paramMap.subscribe((data)=>{
    // this.workOrderId=data.get('id');
    console.log("invite-------------->"+data.get('details'))
    this.token=data.get('details')
  })

  this.inviteForm=this.formBuilder.group({
   
    password:['',Validators.required],
    cpassword:['',Validators.required]
  })
  this.invitaionService.getUser(this.companyId,this.token).subscribe((data)=>{
    this.user=data as User;
    // this.checkAccount=this.authService.checkAccountExistence(this.user?.email);
    // this.authService.checkAccount(this.user?.email).then((data:boolean)=>{
    //   this.authService.resetPassword(this.user?.email);
    // })
    // console.log(this.checkAccount);
    console.log(this.user)
  },
  (err)=>{
    console.log(err);
  })
  
  this.subscribeToService();
  
 

 }
 register(){
  console.log(this.inviteForm.value);
  console.log(this.user);
  this.user.password=this.inviteForm.controls['password'].value,



  this.authService.registerForUser(this.user.email,this.inviteForm.controls['password'].value).then((data:boolean)=>{
    if(data){
    this.invitaionService.register(this.user).subscribe((data)=>{
      console.log("Invitation successfully registered");
      // this.triggerAlert(" Password Reset Successful!!","success");
    setInterval(() => {
      this.router.navigate(['/login']);
    }, 5000);
     },
     (err)=>{
      console.log(err);
     })
    }
    else{
      // this.triggerAlert(" Some issue occured!!!!","danger");
    }
    
    
  })
  .catch((error: any) => {
    // Handle any errors that occur during registration
    console.error('Error during registration:', error);
    // You can display an error message or take other actions
  });

 
 }
 triggerAlert(message: string, type: string) {
  this.alertMessage = message;
  this.alertType = type;
  this.showAlert = true;
  // You can set a timeout to automatically hide the alert after a certain time
  setTimeout(() => {
    this.showAlert = false;
  }, 5000); // Hide the alert after 5 seconds (adjust as needed)
}

subscribeToService() {
  this.invitaionService.getTriggerFunctionSubjectRegister().subscribe((mydata:any) => {
    console.log("trigger register in service vallleeddd2222")
    this.triggerAlert(mydata.data,mydata.type); // Call your component function here
  });
}
}
