import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private headers = new HttpHeaders({
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    'Content-Type': 'application/json',
    'Device-ID': `${localStorage.getItem('deviceId')}`
  });
   companyCustomerEndpoint=environment.endpoint+"companycustomer/"
     paymentEndpoint=environment.endpoint+"payment/"
  constructor(private httpClient:HttpClient) { }

  stateList():Observable<any>{

    return this.httpClient.get(this.companyCustomerEndpoint+"statelist",{headers:this.headers});
   
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
}
