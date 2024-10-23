import { Component } from '@angular/core';
import { SubscriptionService } from './subscription.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class SubscriptionComponent {
  expiryDate!:Date;
  curr_amount:any;
  curr_phase=1
  hover:any;
  basicIsMonthly!:boolean;
  basicMonthlyCharge!:number;
  basicAnnualChargeInMonth!:number;
  basicAnnualCharge!:number;
  basicAnnualDiscount!:number;
  person:number=1
  stateList=[]
  paymentForm!:FormGroup;
  companyId: any;

  constructor(private subcriptionSerive:SubscriptionService,private formBuilder:FormBuilder){}

  ngOnInit(){
    this.companyId=localStorage.getItem('companyId');
    this.expiryDate=new Date()
    this.paymentForm=this.formBuilder.group({

      companyId:[this.companyId],
    address:['',Validators.required],
    city:['',Validators.required],
    state:['',Validators.required],
    zipCode:['',Validators.required],
    mode:['',Validators.required]

  
      



    });
  this.curr_phase=1 
  this.basicMonthlyCharge=10;
  this.basicAnnualChargeInMonth=9;
  this.basicAnnualDiscount=10;
  this.curr_amount=this.basicMonthlyCharge;
  this.basicIsMonthly=true;

  this.subcriptionSerive.stateList().subscribe((data)=>{
    this.stateList=data;
     console.log("stateList-------->"+this.stateList)
  })
  }
  
  basicMonthClick(){
    this.basicIsMonthly=true;
   
    this.curr_amount=this.basicMonthlyCharge;
    this.expiryDate=new Date()
    this.expiryDate.setMonth(this.expiryDate.getMonth() + 1);
    console.log(this.basicIsMonthly)
  }
  basicAnnualClick(){
    this.basicIsMonthly=false;

    this.curr_amount=this.basicAnnualChargeInMonth;
    this.basicAnnualCharge=this.basicAnnualChargeInMonth*12;
    this.expiryDate=new Date()
    this.expiryDate.setFullYear(this.expiryDate.getFullYear() + 1);
    console.log(this.basicIsMonthly)
  }

  proceed(){
    console.log("Phase 2")
    this.curr_phase=2;
  }
  addPerson(){
    this.person=this.person+1
  }
  removePerson(){
    if(this.person>1){
      this.person=this.person-1
    }
  }
  onBack(){
    if(this.curr_phase>1){
      this.curr_phase=this.curr_phase-1;
    }
  }
  addPaymentInformation(){
    console.log(this.paymentForm.value)
  }
 
}
