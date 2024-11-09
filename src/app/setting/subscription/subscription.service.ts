import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  
  private headers = new HttpHeaders({
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    'Content-Type': 'application/json'
  });

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
}
