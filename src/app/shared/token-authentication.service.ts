import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TokenAuthenticationService {

  constructor(private httpClient:HttpClient) { }
  // endpoint="http://customer-lb2-1979550990.us-east-1.elb.amazonaws.com:8080/";
  endpoint=environment.endpoint;
  loginToken(email:string):Observable<any>{
    // const headers = new HttpHeaders({
    //   // 'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    //   // 'Content-Type': 'application/json',
    //   'spring.cloud.function.definition': 'getLoginToken'
    // });
    return this.httpClient.get(this.endpoint+'customer/getLoginToken/'+email);
  }
  getCompanyId(email:any):Observable<any>{
    
    return this.httpClient.get(this.endpoint+'customer/getCompanyId/'+email);
  }
  getAccountInfo(email:string):Observable<any>{
    // const headers = new HttpHeaders({
    //   // 'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    //   // 'Content-Type': 'application/json',
    //   'spring.cloud.function.definition': 'getAccountInfo'
    // });
    
    // return this.httpClient.get('http://localhost:8080/customer/accountInfo/'+email);
    return this.httpClient.get(this.endpoint+'customer/accountInfo/'+email);

  }
  updateAccountInfo(data:any):Observable<any>{
    
    return this.httpClient.post(this.endpoint+'customer/accountInfo/update',data);
  }
 
}
