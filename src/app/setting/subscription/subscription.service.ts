import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaymentIntent } from '@stripe/stripe-js';
@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  
  private headers = new HttpHeaders({
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    'Content-Type': 'application/json',
    'Device-ID': `${localStorage.getItem('deviceId')}`
  });
  private readonly clientId!: string

  constructor(private httpClient:HttpClient) { }

 companyCustomerEndpoint=environment.endpoint+"companycustomer/"
 subscriptionEndpoint=environment.endpoint+"subscription/"
  paymentEndpoint=environment.endpoint+"payment/"
  stateList():Observable<any>{

    return this.httpClient.get(this.companyCustomerEndpoint+"statelist",{headers:this.headers});
   
  }
  addPayment(payment:any):Observable<any>{

    return this.httpClient.post(this.paymentEndpoint+"add",payment,{headers:this.headers});
   
  }
  addSubscription(subscription:any):Observable<any>{

    return this.httpClient.post(this.subscriptionEndpoint+"add",subscription,{headers:this.headers});
   
  }
  getCurrSubscription(companyId:any):Observable<any>{

    return this.httpClient.get(this.subscriptionEndpoint+'currentSubscription/'+companyId,{headers:this.headers});
  }
  createPaymentIntent(params: any): Observable<any> {
    // return this.http.post<PaymentIntent>(
    //   `${PlutoService.BASE_URL}/payments/create-payment-intent`,
    //   params,
    //   { headers: { merchant: this.clientId } }
    // );
    const myheaders = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json',
      'Device-ID': `${localStorage.getItem('deviceId')}`
    });
    // this.headers.append( merchant: this.clientId )
    return this.httpClient.post(this.paymentEndpoint+'create-intent',params, { headers: myheaders});
  }
  working(): Observable<any> {
  
    const myheaders = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json',
      'Device-ID': `${localStorage.getItem('deviceId')}`
    });
    // this.headers.append( merchant: this.clientId )
    return this.httpClient.get(this.paymentEndpoint+'checkCred', { headers: myheaders});
  }


}
