import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordAdminService {

  constructor(private httpClient:HttpClient) { }
  // endpoint="http://customer-lb2-1979550990.us-east-1.elb.amazonaws.com:8080/";
  endpoint=environment.endpoint
 
  sendOtp(email:string):Observable<any>{
  
    
    return this.httpClient.post(this.endpoint+'admin/send-otp',email,{
      responseType:'text'
    });
  }
  validateOtp(email:string,otp:string):Observable<any>{
  
    const obj={
      "email": email,
      "otp": otp
    }
    return this.httpClient.post(this.endpoint+'admin/validate-otp',obj);
  }
  resetPassword(email:string,password:string):Observable<any>{
  
    const obj={
      "email": email,
      "password": password
    }
    return this.httpClient.post(this.endpoint+'admin/resetPassword',obj);
  }
}
