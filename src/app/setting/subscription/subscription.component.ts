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
declare var bootstrap: any;
import {
  StripeCardElement,
  StripeCardElementOptions,
  StripeElementsOptions,
} from '@stripe/stripe-js';
import {
  injectStripe,
  StripeService,
  StripePaymentElementComponent,
} from 'ngx-stripe';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css'],
})
export class SubscriptionComponent {
  @ViewChild(StripePaymentElementComponent)
  paymentElement!: StripePaymentElementComponent;
  // private readonly fb = inject(UntypedFormBuilder);
  private readonly fb = inject(FormBuilder);

  expiryDate!: any;
  curr_amount: any;
  curr_phase = 1;
  res_amount!: any;
  hover: any;
  basicIsMonthly!: boolean;
  basicMonthlyCharge!: number;
  basicAnnualChargeInMonth!: number;
  basicAnnualCharge!: number;
  basicAnnualDiscount!: number;
  person: number = 1;
  stateList = [];
  paymentForm!: FormGroup;
  companyId: any;
  cardForm!: FormGroup;
  checkoutForm!: FormGroup;
  cardDetails!: FormGroup;
  subscription!: Subscription;
  payment!: Payment;
  loading: boolean = false;
  currOption = 1;
  currSubscription!: Subscription;
  upcomingSubscription!: any;
  subscriptionList!: Subscription[];
  todayDate!: Date;
  paymentIntiated: boolean = false;
  planId!: string;
  displayAddCard: boolean = false;
  alertMessage: string = '';
  showAlert: boolean = false; // Flag to toggle alert visibility
  alertType: string = 'success'; // Alert type: success, warning, error, etc.
  myCard: any;
  editCard: boolean = false;
  selectedCard: any;
  renewDate: any;
  email: any;
  cardholderName: any;
  companyEmail: any;
  InvoiceList: Payment[] = [];
  editVisibility: boolean = false;
  editButtonId: number = -1;
  popUpModel:any;
  readonly stripe = injectStripe(
    'pk_test_51QJEvHDbrtjFAyfvm2UQu2ohdlUl814jAftZVEW9IHnfd4YrVOfh5ZBJyfYahnJcOMxwjgK3WjA8tU8XPg5nGpbM00J9CxIx3A'
  );
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
          color: '#CFD7E0',
        },
      },
    },
    hidePostalCode: true,
  };
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
  savingCard = signal(false);
  constructor(
    private subcriptionSerive: SubscriptionService,
    private formBuilder: FormBuilder,
    private router: Router,
    private auth: AuthService,
    private stripeService: StripeService,
    private http: HttpClient
  ) {}
  refresh(){
    this.subcriptionSerive.getCurrSubscription(this.companyId).subscribe(
      (data) => {
        console.log(data);
        this.currSubscription = data;
        if (data != null) {
          console.log(data.expiryDate);
          console.log(data.subscriptionDate);

          this.currSubscription.expiryDate = new Date(data.expiryDate);
          this.currSubscription.subscriptionDate = new Date(
            data.subscriptionDate
          );
          this.renewDate = new Date(data.expiryDate);
          this.renewDate.setDate(this.renewDate.getDate() + 1);
        }
        this.subcriptionSerive.getAllInvoice(this.companyId).subscribe(
          (data) => {
            this.companyId;
            this.InvoiceList = data;
            console.log(this.InvoiceList);
          },
          (err) => {
            console.log(err);
          }
        );

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
      (err) => {
        console.log(err);
      }
    );
    this.subcriptionSerive.getCardDetailsFromStripe(this.companyId).subscribe(
      (data) => {
        this.myCard = data;
        // console.log(this.myCard)
      },
      (err) => {
        console.log(err);
      }
    );
    this.subcriptionSerive
    .getAllSubscription(this.companyId)
    .subscribe((data) => {
      console.log(data);

      this.subscriptionList = data;
      this.subscriptionList.forEach((element) => {
        if (element.status == SubscriptionEnum.UPCOMING) {
          this.upcomingSubscription = element;
        }
      });
    });
    this.curr_phase = 1;
  }
  ngOnInit() {
    this.companyId = localStorage.getItem('companyId');
    this.expiryDate = new Date();
    this.loading = false;
    this.todayDate = new Date();
    this.displayAddCard = false;
    this.email = localStorage.getItem('user');
    this.companyEmail = localStorage.getItem('companyEmail');
    this.paymentIntiated = false;
    console.log('Paying->' + this.paying());
    this.cardDetails = this.formBuilder.group({
      companyId: [this.companyId],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      cardNumber: [
        '',
        [Validators.required, Validators.pattern(/^\d{4} \d{4} \d{4} \d{4}$/)],
      ],
      expiry: ['', [Validators.required, Validators.pattern(/^\d{2}\/\d{2}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
    });

    this.paymentForm = this.formBuilder.group({
      companyId: [this.companyId],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
      mode: ['', Validators.required],
    });

    this.cardForm = this.formBuilder.group({
      cardNumber: [
        '',
        [Validators.required, Validators.pattern('^[0-9 ]{19}$')],
      ],
      cardName: ['', Validators.required],
      expiryDate: [
        '',
        [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])/(\\d{2})$')],
      ],
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3}$')]],
      cardType: ['', Validators.required],
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

    this.editCard = false;
    this.subcriptionSerive
      .getAllSubscription(this.companyId)
      .subscribe((data) => {
        console.log(data);

        this.subscriptionList = data;
        this.subscriptionList.forEach((element) => {
          if (element.status == SubscriptionEnum.UPCOMING) {
            this.upcomingSubscription = element;
          }
        });
      });
    this.subcriptionSerive.getCurrSubscription(this.companyId).subscribe(
      (data) => {
        console.log(data);
        this.currSubscription = data;
        if (data != null) {
          console.log(data.expiryDate);
          console.log(data.subscriptionDate);

          this.currSubscription.expiryDate = new Date(data.expiryDate);
          this.currSubscription.subscriptionDate = new Date(
            data.subscriptionDate
          );
          this.renewDate = new Date(data.expiryDate);
          this.renewDate.setDate(this.renewDate.getDate() + 1);
        }
        this.subcriptionSerive.getAllInvoice(this.companyId).subscribe(
          (data) => {
            this.companyId;
            this.InvoiceList = data;
            console.log(this.InvoiceList);
          },
          (err) => {
            console.log(err);
          }
        );

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
      (err) => {
        console.log(err);
      }
    );
    this.subcriptionSerive.getCardDetailsFromStripe(this.companyId).subscribe(
      (data) => {
        this.myCard = data;
        // console.log(this.myCard)
      },
      (err) => {
        console.log(err);
      }
    );
    this.curr_phase = 1;
    this.basicMonthlyCharge = 10;
    this.basicAnnualChargeInMonth = 9;
    this.basicAnnualDiscount = 10;
    this.curr_amount = this.basicMonthlyCharge;
    this.basicIsMonthly = true;
    this.basicMonthClick();
    this.subcriptionSerive.stateList().subscribe((data) => {
      this.stateList = data;
      console.log('stateList-------->' + this.stateList);
    });

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
      state: '',
    });
  }

  collectPayment() {
    console.log('Payemnt');
    console.log('paying->' + this.paying());
    console.log('invalid->' + this.checkoutForm.invalid);

    this.subcriptionSerive.working().subscribe(
      (data) => {
        console.log(data);
      },
      (err) => {
        if (err.status == '403') {
          alert('Session expired');
          this.logout();
        }
      }
    );
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
              email: this.companyEmail as string,
              address: {
                line1: address as string,
                postal_code: zipcode as string,
                state: state as string,
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
            alert(result.error.message);
          } else if (result.paymentIntent.status === 'succeeded') {
            this.payment = new Payment();
            this.payment.companyId = this.companyId;
            this.payment.cardholderName =
              this.checkoutForm.controls['name'].value;
            this.payment.amount = this.res_amount;
            this.payment.currency = 'USD';
            this.payment.paymentStatus = PaymentStatus.COMPLETED;
            this.payment.transactionDate = new Date();
            this.payment.description = 'Not Real Payment';

            this.subscription = new Subscription();
            this.subscription.companyId = this.companyId;
            this.subscription.person = this.person;
            this.subscription.plan = 'basic duo';
            this.subscription.amount = this.res_amount;
            this.subscription.status = SubscriptionEnum.ACTIVE;
            this.subscription.subscriptionDate = new Date();
            this.subscription.expiryDate = this.expiryDate;
            this.subscription.subscriptionPlan =
              this.basicIsMonthly == true
                ? SubscriptionPlan.MONTHLY
                : SubscriptionPlan.ANNUAL;

            this.subcriptionSerive.addPayment(this.payment).subscribe(
              (data) => {
                console.log(data);
                this.subcriptionSerive
                  .addSubscription(this.subscription)
                  .subscribe(
                    (data) => {
                      console.log(data);
                    },
                    (err) => {
                      console.log(err);
                    },
                    () => {
                      this.paying.set(false);
                      console.log('Payment Successful');
                      this.curr_phase = this.curr_phase + 1;
                    }
                  );
              },
              (err) => {
                this.paying.set(false);
                console.log(err);
                this.loading = false;
              }
            );
          }
        },
        error: (err) => {
          this.paying.set(false);
          alert(err.message);
        },
      });
  }
  get amount() {
    const amountValue = this.checkoutForm.get('amount')?.value;
    if (!amountValue || amountValue < 0) return 0;

    return Number(amountValue);
  }
  basicMonthClick() {
    this.basicIsMonthly = true;

    this.curr_amount = this.basicMonthlyCharge;
    this.expiryDate = new Date();
    this.expiryDate.setMonth(this.expiryDate.getMonth() + 1);
    console.log(this.basicIsMonthly);
    console.log(this.expiryDate);
  }
  basicAnnualClick() {
    this.basicIsMonthly = false;

    this.curr_amount = this.basicAnnualChargeInMonth;
    this.basicAnnualCharge = this.basicAnnualChargeInMonth * 12;
    this.expiryDate = new Date();
    this.expiryDate.setFullYear(this.expiryDate.getFullYear() + 1);
    console.log(this.basicIsMonthly);
    console.log(this.expiryDate);
  }
  createSubscription(cardElement: any) {
    // Ensure cardElement is not null before using it
    // if (!cardElement || !cardElement.element) {
    //   console.error("❌ Stripe Card Element is not initialized.");
    //   return;
    // }
    this.paying.set(true);
    this.stripeService
      .createPaymentMethod({
        type: 'card',
        card: cardElement.element as StripeCardElement, // ✅ Ensure correct type
        billing_details: {
          name: this.checkoutForm.controls['name'].value,
          email: this.companyEmail,
          address: {
            line1: this.checkoutForm.controls['address'].value,
            postal_code: this.checkoutForm.controls['zipcode'].value,
            state: this.checkoutForm.controls['state'].value,
            city: this.checkoutForm.controls['city'].value,
          },
        },
      })
      .subscribe((result) => {
        if (result.paymentMethod) {
          console.log('✅ Payment Method Created:', result.paymentMethod.id);
          let plan = this.basicIsMonthly == true ? 'MONTHLY' : 'ANNUAL';
          this.subcriptionSerive
            .createPaymentIntent(
              result.paymentMethod.id,
              localStorage.getItem('companyEmail'),
              localStorage.getItem('companyName'),
              this.companyId,
              this.person,
              plan,
              this.res_amount,
              this.checkoutForm.controls['name'].value
            )
            .subscribe(
              (data) => {
                console.log(data);
                console.log('Payment Done');
                // this.triggerAlert("Payment Done Successfully", "success");
                // this.ngOnInit();
                this.curr_phase = 3;
                this.paying.set(false);
              },
              (err) => {
                console.log(err.error.errorMessage);
                console.log(err);
                this.paying.set(false);
                this.triggerAlert(err.error.errorMessage, 'danger');
              }
            );
        } else {
          console.error('❌ Error Creating Payment Method:', result.error);
        }
      });
  }

  proceed() {
    console.log('Phase 2');
    // this.paymentIntiated=true;
    if (this.basicIsMonthly == true) {
      this.res_amount = this.curr_amount * this.person;
    } else {
      this.res_amount = this.curr_amount * this.person * 12;
    }
    // console.log("Total Amount"+this.res_amount);
    // this.checkoutForm.controls['amount'].setValue(this.res_amount);
    // console.log("")
    // this.subcriptionSerive
    // .createPaymentIntent({
    //   name:localStorage.getItem('companyName'),
    //   email:localStorage.getItem('companyEmail'),
    //   plan: this.basicIsMonthly ? "MONTHLY" : "ANNUAL",
    //   companyId:this.companyId,
    //   quantity:this.person

    // })
    // .subscribe((pi) => {
    //   console.log(pi)
    //   this.elementsOptions.clientSecret = pi.clientSecret as string;
    //   console.log( this.elementsOptions.clientSecret)
    // });
    // this.router.navigate(['/payment'], {
    //   queryParams: { person: this.person, plan: this.planId },
    // });

    this.curr_phase = 2;
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
  addPerson() {
    this.person = this.person + 1;
  }
  removePerson() {
    if (this.person > 1) {
      this.person = this.person - 1;
    }
  }
  onBack() {
    if (this.curr_phase > 1) {
      this.curr_phase = this.curr_phase - 1;
    }
    if (this.curr_phase == 1) {
      this.paymentIntiated = false;
    }
  }
  addPaymentInformation() {
    console.log(this.paymentForm.value);
    this.curr_phase = 3;
  }
  formatCardNumber(): void {
    let cardNumber = this.cardForm.get('cardNumber')?.value.replace(/\D/g, ''); // Remove all non-numeric characters
    if (cardNumber.length > 4) {
      cardNumber = cardNumber.match(/.{1,4}/g)?.join(' ') || cardNumber; // Add space every 4 digits
    }
    this.cardForm.get('cardNumber')?.setValue(cardNumber, { emitEvent: false });
  }

  formatExpiryDate(): void {
    let expiryDate = this.cardForm
      .get('expiryDate')
      ?.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    if (expiryDate.length >= 3) {
      expiryDate =
        expiryDate.substring(0, 2) + '/' + expiryDate.substring(2, 4); // Format as MM/YY
    }
    this.cardForm.get('expiryDate')?.setValue(expiryDate, { emitEvent: false });
  }

  onClick(data: any) {
    this.currOption = data;
  }
  addCard() {
    console.log('www');
    this.displayAddCard = true;
  }
  closeAddCard() {
    this.displayAddCard = false;
    this.cardDetails.reset();
  }
  addCardDetails() {
    // console.log(this.cardDetails.value)
    // this.subcriptionSerive.addCardDetails(this.cardDetails.value).subscribe((data)=>{
    //   console.log(data);
    //   this.displayAddCard=false;
    //   this.cardDetails.reset();
    //   this.triggerAlert("Card Added Successfully","success")
    //   this.ngOnInit()

    // },
    // (err)=>{
    //   console.log(err);
    //   this.displayAddCard=false;
    //   this.cardDetails.reset();
    //   this.triggerAlert(err.errorMessage,"danger")
    // })
    console.log('Save Card');
    // this.saveCard();
  }
  formatSavedCardNumber(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, ''); // Remove non-digits
    value = value.match(/.{1,4}/g)?.join(' ') ?? value; // Add spaces every 4 digits
    input.value = value;
    this.cardDetails.get('cardNumber')?.setValue(value);
  }

  formatExpiry(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, ''); // Remove non-digits

    // Format as MM/YY
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    input.value = value;

    // Validate expiry date
    const isValid = this.validateExpiry(value);
    if (isValid) {
      input.style.borderColor = ''; // Reset border color if valid
      this.cardDetails.get('expiry')?.setValue(value);
    } else {
      input.style.borderColor = 'red'; // Highlight input in red if invalid
    }
  }
  validateExpiry(expiry: string): boolean {
    const [month, year] = expiry.split('/').map((val) => parseInt(val, 10));

    if (!month || !year || month < 1 || month > 12) {
      return false; // Invalid month
    }

    const currentYear = new Date().getFullYear() % 100; // Get last two digits of the current year
    const currentMonth = new Date().getMonth() + 1;

    // Check if the year and month are in the future
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return false; // Expiry is in the past
    }

    return true; // Expiry is valid
  }
  validateCVV(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length > 3) {
      value = value.slice(0, 3); // Limit to 3 digits
    }
    input.value = value;
    this.cardDetails.get('cvv')?.setValue(value);
  }
  getLastFourDigits(cardNumber: string | undefined): string {
    return cardNumber ? cardNumber.slice(-4) : '';
  }
  editCardFunc(id: any) {
    console.log('edit ');
    this.selectedCard = id;
    this.editCard = true;
  }
  deleteCardBack() {
    this.editCard = false;
  }
  removeSaveCard(cardId: any) {
    console.log(cardId);
    this.subcriptionSerive.deleteCardDetails(cardId).subscribe(
      (data) => {
        console.log(data);
        this.triggerAlert('Card Deleted Successfully', 'success');
        this.ngOnInit();
        this.editCard = false;
      },
      (err) => {
        console.log(err);
        this.triggerAlert(err.errorMessage, 'danger');
      }
    );
    this.editCard = false;
  }
  logout() {
    console.log('logging out');
    this.auth.currUser = null;
    this.auth.isLoggedIn = false;
    // localStorage.removeItem('token');
    // localStorage.removeItem('currOption');
    // localStorage.removeItem('authToken');
    // localStorage.removeItem('companyId');
    //   localStorage.removeItem('user');
    //   localStorage.removeItem('selectedExtraColumsAssets')
    //   localStorage.removeItem("showMandatoryBasicFieldsAssets")
    localStorage.clear();
    localStorage.getItem('uploadProgress');
    localStorage.getItem('uploadInProgress');
    this.router.navigate(['/login']);
  }
  triggerAlert(message: string, type: string) {
    console.log('triiger');
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;
    // You can set a timeout to automatically hide the alert after a certain time
    setTimeout(() => {
      this.showAlert = false;
    }, 5000); // Hide the alert after 5 seconds (adjust as needed)
  }
  saveCard(cardElement: any, cardholderName: any) {
    this.savingCard.set(true);
    console.log(cardholderName.value);
    if (!cardElement) {
      console.error('Card Element is not initialized.');
      return;
    }

    this.stripeService
      .createPaymentMethod({
        type: 'card',
        card: cardElement.element,
        billing_details: {
          name: cardholderName, // ✅ Adding cardholder name
        },
      })
      .subscribe((result) => {
        if (result.paymentMethod) {
          let companyEmail = localStorage.getItem('companyEmail');
          console.log(companyEmail);
          this.subcriptionSerive
            .cardSaveStripe(
              result,
              companyEmail,
              cardholderName,
              this.companyId
            )
            .subscribe(
              (data) => {
                console.log(data);
                console.log('Card Saved Successfully');
                this.triggerAlert('Card Saved Successfully', 'success');
                this.savingCard.set(false);
                this.ngOnInit();
              },
              (err) => {
                console.log(err);
                this.triggerAlert(err.errorMessage, 'danger');
                this.savingCard.set(false);
              }
            );
        } else {
          console.error(result.error);
          this.savingCard.set(false);
        }
      });
  }

  getCardLogo(brand: string): string {
    const cardLogos: { [key: string]: string } = {
      visa: 'assets/card-logos/visa.svg',
      mastercard: 'assets/card-logos/mastercard.svg',
      amex: 'assets/card-logos/amex.svg',
      discover: 'assets/card-logos/discover.svg',
      diners: 'assets/card-logos/diners.svg',
      jcb: 'assets/card-logos/jcb.svg',
      unionpay: 'assets/card-logos/unionpay.svg',
      default: 'assets/card-logos/default-card.svg', // Generic card image
    };
    return cardLogos[brand.toLowerCase()] || cardLogos['default'];
  }

  editButtonVisibile(id: number) {
    //  console.log(id);
    this.editButtonId = id;
    this.editVisibility = true;
  }
  editButtonNotVisible() {
    this.editVisibility = false;
    this.editButtonId = -1;
  }
  downloadInvoice(id: any) {
    console.log(id);
    // this.subcriptionSerive.downloadInvoice(id).subscribe((data)=>{
    //   console.log(data);
    //   var blob = new Blob([data], { type: 'application/pdf' });
    //   var url= window.URL.createObjectURL(blob);
    //   window.open(url);
    // },
    // (err)=>{
    //   console.log(err);
    // })
  }
  closeAddPlan(){
    console.log("Closing Add Plan");
    // const modalElement = document.getElementById('addPerson');
    // console.log(modalElement);
  
    this.popUpModel.hide();
  }
  checkUpcomingPlan(){
    if(this.upcomingSubscription){
      console.log("Cancel Upcoming Plan");
      this.triggerAlert("You have an upcoming plan. Please cancel it to proceed","warning");
      return;
    }
    console.log("Add Plan");
    const modalElement = document.getElementById('addPerson');
    this.popUpModel = new bootstrap.Modal(modalElement);
    this.popUpModel.show();
        // setTimeout(()=>{
        //   modalInstance.hide();
        // },5000)


    
  }
  deleteUpcomingPlan() {
    this.loading = true;
    this.subcriptionSerive
      .deleteUpcomingSubscription(
        this.companyId,
        localStorage.getItem('companyName'),
        localStorage.getItem('companyEmail')
      )
      .subscribe(
        (data) => {
          console.log('Upcoming plan deleted:', data);
          this.triggerAlert('Upcoming Plan Deleted Successfully', 'success');
          this.loading = false;
  
          // Explicitly refresh the data
          this.subcriptionSerive.getAllSubscription(this.companyId).subscribe((data) => {
            console.log('Refreshed subscription list:', data);
            this.subscriptionList = data;
            this.upcomingSubscription = null; // Reset the upcoming subscription
            this.subscriptionList.forEach((element) => {
              if (element.status == SubscriptionEnum.UPCOMING) {
                this.upcomingSubscription = element;
              }
            });
          });
        },
        (err) => {
          console.log(err);
          this.loading = false;
          this.triggerAlert(err.errorMessage, 'danger');
        }
      );
  }
  startUpcomingPlan(){

    this.subcriptionSerive.startUpcomingSubscription(this.companyId,localStorage.getItem('companyName'),localStorage.getItem('companyEmail')).subscribe((data)=>{
      console.log(data);
     
      
      this.triggerAlert("Upcoming Plan Started Successfully","success");
      this.ngOnInit();
    }
    ,
    (err)=>{
      console.log(err);
      this.triggerAlert(err.error.errorMessage,"danger");
    }
    )
  }
  payWithSavedCard(cardId: any) {
    console.log(cardId);
    this.paying.set(true);
    let plan = this.basicIsMonthly == true ? 'MONTHLY' : 'ANNUAL';
    this.subcriptionSerive
            .createPaymentIntent(
              cardId,
              localStorage.getItem('companyEmail'),
              localStorage.getItem('companyName'),
              this.companyId,
              this.person,
              plan,
              this.res_amount,
              this.checkoutForm.controls['name'].value
            )
            .subscribe(
              (data) => {
                
                console.log(data);
                console.log('Payment Done');
                // this.triggerAlert("Payment Done Successfully", "success");
                // this.ngOnInit();
                this.curr_phase = 3;
                this.paying.set(false);
              },
              (err) => {
                console.log(err.error.errorMessage);
                console.log(err);
                this.paying.set(false);
                this.triggerAlert(err.error.errorMessage, 'danger');
              }
            );
  }
  goToManageTab(){
    this.ngOnInit();
    this.currOption=1;
    
  }
}
