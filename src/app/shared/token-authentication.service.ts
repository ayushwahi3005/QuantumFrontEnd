import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TokenAuthenticationService {

  constructor(private httpClient:HttpClient) { }
  endpoint=environment.endpoint;
  loginToken(email:string,password:string,deviceId:string):Observable<any>{

    const obj={
      email:email,
      password:password,
      deviceId:deviceId
    }
    return this.httpClient.post(this.endpoint+'customer/getLoginToken',obj);
  }
  getCompanyId(email:any):Observable<any>{
    
    return this.httpClient.get(this.endpoint+'customer/getCompanyId/'+email);
  }
  getAccountInfo(email:string):Observable<any>{

    return this.httpClient.get(this.endpoint+'customer/accountInfo/'+email);

  }
  updateAccountInfo(data:any):Observable<any>{
    
    return this.httpClient.post(this.endpoint+'customer/accountInfo/update',data);
  }
  addLoggedIn(data:any):Observable<any>{
    console.log("Authrntication loggedIN data")
    console.log(data)
    return this.httpClient.post(this.endpoint+'customer/addLoggedIn',data);
  }
  getCustomer(email:any):Observable<any>{
    
    return this.httpClient.get(this.endpoint+'customer/checkUserName/'+email);
  }
  removeSession(userId:string):Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json',
      'Device-ID': `${localStorage.getItem('deviceId')}`,
    });
    
    return this.httpClient.delete(this.endpoint+'customer/removeSession/'+userId, { headers });
  }
}
