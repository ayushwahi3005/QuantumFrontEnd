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
  customerEndpoint=environment.endpoint+"customer/"
  stateList():Observable<any>{

    return this.httpClient.get(this.companyCustomerEndpoint+"statelist",{headers:this.headers});
   
  }
  addPayment(payment:any):Observable<any>{

    return this.httpClient.post(this.paymentEndpoint+"add",payment,{headers:this.headers});
   
  }
  getAllInvoice(companyId:string):Observable<any>{

    return this.httpClient.get(this.paymentEndpoint+"get-invoices/"+companyId,{headers:this.headers});
   
  }
  addSubscription(subscription:any):Observable<any>{

    return this.httpClient.post(this.subscriptionEndpoint+"add",subscription,{headers:this.headers});
   
  }
  getCurrSubscription(companyId:any):Observable<any>{

    return this.httpClient.get(this.subscriptionEndpoint+'currentSubscription/'+companyId,{headers:this.headers});
  }
  createPaymentIntent(paymentMethodId:any,email:any,name:any,companyId:any,quantity:any,plan:any,amount:any,cardholderName:any): Observable<any> {
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
    return this.httpClient.post(this.paymentEndpoint+'create-subscription',{paymentMethodId: paymentMethodId,email:email,name:name,companyId:companyId,quantity:quantity,subscriptionPlan:plan,amount:amount,cardHolderName:cardholderName}, { headers: myheaders});
  }
  // createPaymentIntent(params: any): Observable<any> {
  //   // return this.http.post<PaymentIntent>(
  //   //   `${PlutoService.BASE_URL}/payments/create-payment-intent`,
  //   //   params,
  //   //   { headers: { merchant: this.clientId } }
  //   // );
  //   const myheaders = new HttpHeaders({
  //     'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
  //     'Content-Type': 'application/json',
  //     'Device-ID': `${localStorage.getItem('deviceId')}`
  //   });
  //   // this.headers.append( merchant: this.clientId )
  //   return this.httpClient.post(this.paymentEndpoint+'create-intent',params, { headers: myheaders});
  // }
  addCardDetails(card:any):Observable<any>{
    return this.httpClient.post(this.customerEndpoint+"addCardDetails",card,{headers:this.headers})
  }
  getCardDetails(companyId:any):Observable<any>{
    return this.httpClient.get(this.customerEndpoint+"getCardDetails/"+companyId,{headers:this.headers})
  }
 
  cardSaveStripe(result:any,email:any,cardholderName:any,companyId:any):Observable<any>{
    return this.httpClient.post(this.paymentEndpoint+'stripe-save-card',{paymentMethodId: result.paymentMethod.id,email:email,cardholderName:cardholderName,companyId:companyId}, { headers:this.headers });
  }
  getCardDetailsFromStripe(companyId:any):Observable<any>{
    return this.httpClient.get(this.paymentEndpoint+'stripe-get-cards/'+companyId, { headers:this.headers });
  }
  deleteCardDetails(id:any):Observable<any>{
    return this.httpClient.delete(this.paymentEndpoint+"stripe-delete-cards/"+id,{headers:this.headers})
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
