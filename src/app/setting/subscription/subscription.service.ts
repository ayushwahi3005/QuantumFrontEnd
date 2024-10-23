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
  stateList():Observable<any>{

    return this.httpClient.get(this.companyCustomerEndpoint+"statelist",{headers:this.headers});
   
  }
}
