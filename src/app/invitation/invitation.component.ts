import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { InvitationService } from './invitation.service';

@Component({
  selector: 'app-invitation',
  templateUrl: './invitation.component.html',
  styleUrls: ['./invitation.component.css']
})
export class InvitationComponent {
 constructor(private activeRoute:ActivatedRoute,private formBuilder:FormBuilder,private invitaionService:InvitationService){}
 inviteForm!:FormGroup;
 companyId!:any;
 token!:any
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
    firstName:['',Validators.required],
    lastName:['',Validators.required],
    email:['',Validators.required],
    mobileNumber:['+1',Validators.required],
    password:['',Validators.required],
    cpassword:['',Validators.required]
  })
 }
 register(){
  console.log(this.inviteForm.value);
 this.invitaionService.register(this.companyId,this.token, this.inviteForm.value).subscribe((data)=>{
  console.log("Invitation successfully registered");
 },
 (err)=>{
  console.log(err);
 })
 }
}
