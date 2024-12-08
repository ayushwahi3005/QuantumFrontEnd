import { Component, Input, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PaymentService } from './payment.service';
import { StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js';
import {
  injectStripe,
  provideNgxStripe,
  StripeCardComponent,
  StripeElementsDirective,
  StripePaymentElementComponent,
  StripeService,
} from 'ngx-stripe';
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {
  @ViewChild(StripePaymentElementComponent)
  paymentElement!: StripePaymentElementComponent;
  
  checkoutForm!:FormGroup
  stateList=[]
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
  elementsOptions!: StripeElementsOptions ;

  paying = signal(false);

constructor(private route: ActivatedRoute,private formBuilder:FormBuilder,private paymentService:PaymentService) {}
ngOnInit() {
  
  this.route.queryParams.subscribe(params => {
    const person = params['person'];
    const plan = params['plan'];
    console.log('Person:', person, 'Plan:', plan);
  });
  this.paymentService.createPaymentIntent({
    amount: 100,
    currency: 'usd',
  }).subscribe((pi) => {
    console.log(pi);
    // Ensure that clientSecret is properly set here
    this.elementsOptions.clientSecret = pi.clientSecret;
    console.log("Client Secret:", this.elementsOptions.clientSecret);
  });
  this.elementsOptions = {
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

  this.checkoutForm = this.formBuilder.group({
    name: ['', [Validators.required]],
    email: [''],
    address: ['', [Validators.required]],
    zipcode: ['', [Validators.required]],
    city: ['', [Validators.required]],
    amount: ['2500'],
  });

  this.paymentService.stateList().subscribe((data) => {
    this.stateList = data;
    console.log("stateList-------->" + this.stateList);
  });


}


  clear() {
    this.checkoutForm.patchValue({
      name: '',
      email: '',
      address: '',
      zipcode: '',
      city: '',
    });
  }

  collectPayment() {
    console.log("Payemnt")
    console.log("paying->"+this.paying())
    console.log("invalid->"+this.checkoutForm.invalid)
    if (this.paying() || this.checkoutForm.invalid) return;
    this.paying.set(true);

    const { name, email, address, zipcode, city } =
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
                city: city as string,
              },
            },
          },
        },
        redirect: 'if_required',
      })
      .subscribe({
        next: (result) => {
          this.paying.set(false);
          if (result.error) {
            alert(result.error.message)
          } else if (result.paymentIntent.status === 'succeeded') {
            alert("Successful")
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
}
