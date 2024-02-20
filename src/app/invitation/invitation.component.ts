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
    console.log(this.user)
  },
  (err)=>{
    console.log(err);
  })
 }
 register(){
  console.log(this.inviteForm.value);
  console.log(this.user);
  this.user.password=this.inviteForm.controls['password'].value,
 this.invitaionService.register(this.user).subscribe((data)=>{
  console.log("Invitation successfully registered");
  this.authService.registerForUser(this.user.email,this.inviteForm.controls['password'].value).then(()=>{
    this.triggerAlert(" Password Reset Successful!!","success");
    setInterval(() => {
      this.router.navigate(['/login']);
    }, 5000);
    
  },
  (err)=>{
    console.log(err);
    this.triggerAlert(" The email address is already in use by another account","danger");
  });
 },
 (err)=>{
  console.log(err);
 })
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
}
