import { Component, inject, signal, ViewChild } from '@angular/core';
import { SubscriptionService } from './subscription.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscriber } from 'rxjs';
import { Subscription } from './subscription';
import { Payment } from './payment';
import { PaymentStatus } from './PaymentStatus';
import { SubscriptionPlan } from './SubscriptionPlan';
import { SubscriptionEnum } from './SubscriptionEnum';
import { format } from 'date-fns';

import { StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js';
import {
  injectStripe,

  StripePaymentElementComponent,

} from 'ngx-stripe';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';


@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class SubscriptionComponent {
  @ViewChild(StripePaymentElementComponent)
  paymentElement!: StripePaymentElementComponent;
  // private readonly fb = inject(UntypedFormBuilder);
  private readonly fb = inject(FormBuilder);

  expiryDate!:any;
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
  checkoutForm!:FormGroup;
  subscription!:Subscription;
  payment!:Payment;
  loading:boolean=false;
  currOption=1;
  currSubscription!:Subscription
  todayDate!:Date;
  paymentIntiated:boolean=false;
  planId!:string;
  readonly stripe = injectStripe("pk_test_51QJEvHDbrtjFAyfvm2UQu2ohdlUl814jAftZVEW9IHnfd4YrVOfh5ZBJyfYahnJcOMxwjgK3WjA8tU8XPg5nGpbM00J9CxIx3A");
  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        lineHeight: '40px',
        fontWeight: 300,
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#CFD7E0'
        }
      }
    }
  }
  elementsOptions: StripeElementsOptions = {
    locale: 'en',
    appearance: {
      theme: 'stripe',
      labels: 'floating',
      variables: {
        colorPrimary: '#673ab7',
      },
    },
    clientSecret: '',
  };

  paying = signal(false);
  constructor(private subcriptionSerive:SubscriptionService,private formBuilder:FormBuilder,private router:Router,private auth:AuthService){}

  ngOnInit(){
    this.companyId=localStorage.getItem('companyId');
    this.expiryDate=new Date()
    this.loading=false;
    this.todayDate=new Date();
    
    this. paymentIntiated=false;
    console.log("Paying->"+this.paying())
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
    this.checkoutForm = this.fb.group({
      name: ['', [Validators.required]],
      email: [''],
      address: ['', [Validators.required]],
      zipcode: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      amount: [''],
    });
    const amount = this.checkoutForm.get('amount')?.value;

   

    this.subcriptionSerive.getCurrSubscription(this.companyId).subscribe((data)=>{
      this.currSubscription=data;
      if(data!=null){console.log(data.expiryDate)
        console.log(data.subscriptionDate)
  
        
        this.currSubscription.expiryDate=new Date(data.expiryDate);
        this.currSubscription.subscriptionDate=new Date(data.subscriptionDate);
      }
      
      // console.log(this.currSubscription.expiryDate[0])
      // this.currSubscription.expiryDate = new Date(
      //   this.currSubscription.expiryDate[0], // Year
      //   this.currSubscription.expiryDate[1] - 1, // Month (0-based in JavaScript)
      //   this.currSubscription.expiryDate[2] // Day
      // );
      // this.currSubscription.subscriptionDate = new Date(
      //   this.currSubscription.subscriptionDate[0], // Year
      //   this.currSubscription.subscriptionDate[1] - 1, // Month (0-based in JavaScript)
      //   this.currSubscription.subscriptionDate[2] // Day
      // );

      
    },
    (err)=>{
      console.log(err);
    })
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

  // this.subcriptionSerive
  //   .createPaymentIntent({
  //     amount:100,
  //     currency: 'usd',
  //   })
  //   .subscribe((pi) => {
  //     console.log(pi)
  //     this.elementsOptions.clientSecret = pi.clientSecret as string;
  //     console.log( this.elementsOptions.clientSecret)
  //   });
  // this.stripeService
  //   .elements(this.elementsOptions)
  //   .subscribe((elements) => {
  //     this.paymentElement = elements.create('card', this.cardOptions); // Create the card element
  //     this.paymentElement.mount('#card-element'); // Mount it to the DOM
  //   });
  
  
  }

  ngOnDestroy(): void {
    // Ensure modal and backdrop are cleaned up
    const modalBackdrop = document.querySelector('.modal-backdrop');
    if (modalBackdrop) {
      modalBackdrop.remove();
    }
    const modals = document.querySelectorAll('.modal');
    modals.forEach((modal) => modal.classList.remove('show'));
  }
  // createToken(): void {
  //   console.log(this.card)
  //   this.stripeService
  //     .createToken(this.card.element, {})
  //     .subscribe((result) => {
  //       if (result.token) {
  //         console.log('Success:', result.token);
  //       } else if (result.error) {
  //         console.log('Error:', result.error.message);
  //       }
  //     });
  // }
  
  clear() {
    this.checkoutForm.patchValue({
      name: '',
      email: '',
      address: '',
      zipcode: '',
      city: '',
      state:''
    });
  }

  collectPayment() {
    console.log("Payemnt")
    console.log("paying->"+this.paying())
    console.log("invalid->"+this.checkoutForm.invalid)

    this.subcriptionSerive.working().subscribe((data)=>{
      console.log(data);
    },
    (err)=>{
      if(err.status=="403"){
        alert("Session expired");
        this.logout();

      }
    })
    if (this.paying() || this.checkoutForm.invalid) return;
    this.paying.set(true);

    const { name, email, address, zipcode, state, city } =
      this.checkoutForm.getRawValue();
    // console.log(name)
    // console.log(email)
    // console.log(address)
    // console.log(zipcode)
    // console.log(city)
    

    this.stripe
      .confirmPayment({
        elements: this.paymentElement.elements,
        confirmParams: {
          payment_method_data: {
            billing_details: {
              name: name as string,
              email: email as string,
              address: {
                line1: address as string,
                postal_code: zipcode as string,
                state:state as string,
                city: city as string,
              },
            },
          },
        },
        redirect: 'if_required',
      })
      .subscribe({
        next: (result) => {
          // this.paying.set(false);
          if (result.error) {
            this.paying.set(false);
            alert(result.error.message)
          } else if (result.paymentIntent.status === 'succeeded') {

            this.payment=new Payment();
            this.payment.companyId=this.companyId;
            this.payment.cardholderName=this.checkoutForm.controls['name'].value;
            this.payment.amount=this.res_amount
            this.payment.currency="USD"
            this.payment.paymentStatus=PaymentStatus.COMPLETED;
            this.payment.transactionDate=new Date();
            this.payment.description="Not Real Payment";


            this.subscription=new Subscription();
            this.subscription.companyId=this.companyId;
            this.subscription.person=this.person;
            this.subscription.plan="basic duo";
            this.subscription.amount=this.res_amount;
            this.subscription.status=SubscriptionEnum.ACTIVE;
            this.subscription.subscriptionDate=new Date();
            this.subscription.expiryDate=this.expiryDate;
            this.subscription.subscriptionPlan=this.basicIsMonthly==true?SubscriptionPlan.MONTHLY:SubscriptionPlan.ANNUAL;


            this.subcriptionSerive.addPayment(this.payment).subscribe((data)=>{
              console.log(data);
              this.subcriptionSerive.addSubscription(this.subscription).subscribe((data)=>{
                console.log(data);
              },
              (err)=>{
                
                console.log(err);
                             
              },
              ()=>{
                this.paying.set(false);
                console.log("Payment Successful")
                this.curr_phase=this.curr_phase+1
              });
            },
            (err)=>{
              console.log(err)
              this.loading=false;
            });
           
            
          }
        },
        error: (err) => {
          this.paying.set(false);
          alert(err.message)
        },
      });
  }
  get amount() {
    const amountValue = this.checkoutForm.get('amount')?.value;
    if (!amountValue || amountValue < 0) return 0;

    return Number(amountValue) ;
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
    this.paymentIntiated=true;
    if(this.basicIsMonthly==true){
      this.res_amount=this.curr_amount*this.person;
    }
    else{
      this.res_amount=this.curr_amount*this.person*12;
    }
    console.log("Total Amount"+this.res_amount);
    this.checkoutForm.controls['amount'].setValue(this.res_amount);
    this.subcriptionSerive
    .createPaymentIntent({
      amount:this.res_amount*100,
      currency: 'usd',
    })
    .subscribe((pi) => {
      console.log(pi)
      this.elementsOptions.clientSecret = pi.clientSecret as string;
      console.log( this.elementsOptions.clientSecret)
    });
    // this.router.navigate(['/payment'], {
    //   queryParams: { person: this.person, plan: this.planId },
    // });
    
    this.curr_phase=2;
  }
  // paymentProcessed(){
  //   this.subscription=new Subscription();
  //   this.subscription.companyId=this.companyId;
  //   this.subscription.person=this.person;
  //   this.subscription.plan="basic duo";
  //   this.subscription.amount=this.res_amount;
  //   this.subscription.status=SubscriptionEnum.ACTIVE;
  //   this.subscription.subscriptionDate=new Date();
  //   this.subscription.expiryDate=this.expiryDate;
  //   this.subscription.subscriptionPlan=this.basicIsMonthly==true?SubscriptionPlan.BASIC:SubscriptionPlan.ANNUAL;



  //   this.payment=new Payment();
  //   this.payment.companyId=this.companyId;
  //   this.payment.cardholderName=this.cardForm.controls['cardName'].value;
  //   this.payment.amount=this.res_amount
  //   this.payment.currency="USD"
  //   this.payment.paymentStatus=PaymentStatus.COMPLETED
  //   this.payment.transactionDate=new Date();
  //   this.payment.description="Not Real Payment";

  //   this.subcriptionSerive.addPayment(this.payment).subscribe((data)=>{
  //     console.log(data);
  //     this.subcriptionSerive.addSubscription(this.subscription).subscribe((data)=>{
  //       console.log(data);
  //     },
  //     (err)=>{
        
  //       console.log(err);
        
  //       this.loading=false;
       
  //     },
  //     ()=>{
  //       this.loading=false;
  //       this.curr_phase=4;
  //     });
  //   },
  //   (err)=>{
  //     console.log(err)
  //     this.loading=false;
  //   });

    





  // }
  // onSubmit(){
  //   this.loading=true;
  //  console.log(this.paymentForm.value)

  //  console.log(this.cardForm.value)
  //  console.log(this.expiryDate)

  //  console.log(this.res_amount)
  //  console.log(this.person)
  //  console.log(this.basicIsMonthly)
  //  let myCardNumber = this.cardForm.controls['cardNumber'].value.replace(/\s+/g, '');
  //  let cvv=this.cardForm.controls['cvv'].value;
  //  console.log(myCardNumber)
  //  console.log(cvv)
  //  if(myCardNumber=='0000000000000000'&&cvv=="123"){
  //   console.log("Test Payment");
  //   this.paymentProcessed();
  //  }
  //  else{
  //   // Integrate with payment Gateway
  //  }

  // }
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
    if(this.curr_phase==1){
      this.paymentIntiated=false;
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

  onClick(data:any){
    this.currOption=data;
  }
  logout(){
    console.log("logging out")
    this.auth.currUser=null;
    this.auth.isLoggedIn=false;
    // localStorage.removeItem('token');
    // localStorage.removeItem('currOption');
    // localStorage.removeItem('authToken');
    // localStorage.removeItem('companyId');
    //   localStorage.removeItem('user');
    //   localStorage.removeItem('selectedExtraColumsAssets')
    //   localStorage.removeItem("showMandatoryBasicFieldsAssets")
      localStorage.clear()
      localStorage.getItem('uploadProgress');
      localStorage.getItem('uploadInProgress');
    this.router.navigate(['/login']);

   
  }
}
