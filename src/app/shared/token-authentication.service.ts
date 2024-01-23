import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenAuthenticationService {

  constructor(private httpClient:HttpClient) { }
  loginToken(email:string):Observable<any>{
    return this.httpClient.get('http://localhost:8080/customer/getLoginToken/'+email);
  }
  getCompanyId(email:any):Observable<any>{
    
    return this.httpClient.get('http://localhost:8080/customer/getCompanyId/'+email);
  }
}
