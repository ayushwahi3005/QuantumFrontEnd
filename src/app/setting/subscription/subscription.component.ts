import { Component } from '@angular/core';
import { SubscriptionService } from './subscription.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscriber } from 'rxjs';
import { Subscription } from './subscription';
import { Payment } from './payment';
import { PaymentStatus } from './PaymentStatus';
import { SubscriptionPlan } from './SubscriptionPlan';




@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class SubscriptionComponent {
  expiryDate!:Date;
  curr_amount:any;
  curr_phase=1
  res_amount!:any;
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
  cardForm!:FormGroup;

  subscription!:Subscription;
  payment!:Payment;
  loading:boolean=false;
  constructor(private subcriptionSerive:SubscriptionService,private formBuilder:FormBuilder){}

  ngOnInit(){
    this.companyId=localStorage.getItem('companyId');
    this.expiryDate=new Date()
    this.loading=false;
    this.paymentForm=this.formBuilder.group({
    
      companyId:[this.companyId],
    address:['',Validators.required],
    city:['',Validators.required],
    state:['',Validators.required],
    zipCode:['',Validators.required],
    mode:['',Validators.required]

  
      



    });

    this.cardForm = this.formBuilder.group({
      cardNumber: ['', [Validators.required, Validators.pattern('^[0-9 ]{19}$')]],
      cardName: ['', Validators.required],
      expiryDate: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])/(\\d{2})$')]],
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3}$')]],
      cardType:['',Validators.required]
   
    });
  this.curr_phase=1
  this.basicMonthlyCharge=10;
  this.basicAnnualChargeInMonth=9;
  this.basicAnnualDiscount=10;
  this.curr_amount=this.basicMonthlyCharge;
  this.basicIsMonthly=true;
  this.basicMonthClick()
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
    console.log(this.expiryDate)
  }
  basicAnnualClick(){
    this.basicIsMonthly=false;

    this.curr_amount=this.basicAnnualChargeInMonth;
    this.basicAnnualCharge=this.basicAnnualChargeInMonth*12;
    this.expiryDate=new Date()
    this.expiryDate.setFullYear(this.expiryDate.getFullYear() + 1);
    console.log(this.basicIsMonthly)
    console.log(this.expiryDate)
  }
 

  proceed(){
    console.log("Phase 2")
    if(this.basicIsMonthly==true){
      this.res_amount=this.curr_amount*this.person;
    }
    else{
      this.res_amount=this.curr_amount*this.person*12;
    }
    console.log("Total Amount"+this.res_amount);
    this.curr_phase=2;
  }
  paymentProcessed(){
    this.subscription=new Subscription();
    this.subscription.companyId=this.companyId;
    this.subscription.person=this.person;
    this.subscription.plan="basic";
    
    this.subscription.subscriptionDate=new Date();
    this.subscription.expiryDate=this.expiryDate;
    this.subscription.subscriptionPlan=this.basicIsMonthly==true?SubscriptionPlan.BASIC:SubscriptionPlan.ANNUAL;



    this.payment=new Payment();
    this.payment.companyId=this.companyId;
    this.payment.cardholderName=this.cardForm.controls['cardName'].value;
    this.payment.amount=this.res_amount
    this.payment.currency="USD"
    this.payment.paymentStatus=PaymentStatus.COMPLETED
    this.payment.transactionDate=new Date();
    this.payment.description="Not Real Payment";

    this.subcriptionSerive.addPayment(this.payment).subscribe((data)=>{
      console.log(data);
      this.subcriptionSerive.addSubscription(this.subscription).subscribe((data)=>{
        console.log(data);
      },
      (err)=>{
        
        console.log(err);
        this.loading=false;
       
      },
      ()=>{
        this.loading=false;
        this.curr_phase=4;
      });
    },
    (err)=>{
      console.log(err)
      this.loading=false;
    });

    





  }
  onSubmit(){
    this.loading=true;
   console.log(this.paymentForm.value)

   console.log(this.cardForm.value)
   console.log(this.expiryDate)

   console.log(this.res_amount)
   console.log(this.person)
   console.log(this.basicIsMonthly)
   let myCardNumber = this.cardForm.controls['cardNumber'].value.replace(/\s+/g, '');
   let cvv=this.cardForm.controls['cvv'].value;
   console.log(myCardNumber)
   console.log(cvv)
   if(myCardNumber=='0000000000000000'&&cvv=="123"){
    console.log("Test Payment");
    this.paymentProcessed();
   }
   else{
    // Integrate with payment Gateway
   }

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
    this.curr_phase=3;
  }
  formatCardNumber(): void {
    let cardNumber = this.cardForm.get('cardNumber')?.value.replace(/\D/g, ''); // Remove all non-numeric characters
    if (cardNumber.length > 4) {
      cardNumber = cardNumber.match(/.{1,4}/g)?.join(' ') || cardNumber; // Add space every 4 digits
    }
    this.cardForm.get('cardNumber')?.setValue(cardNumber, { emitEvent: false });
  }

  formatExpiryDate(): void {
    let expiryDate = this.cardForm.get('expiryDate')?.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    if (expiryDate.length >= 3) {
      expiryDate = expiryDate.substring(0, 2) + '/' + expiryDate.substring(2, 4); // Format as MM/YY
    }
    this.cardForm.get('expiryDate')?.setValue(expiryDate, { emitEvent: false });
  }
}
