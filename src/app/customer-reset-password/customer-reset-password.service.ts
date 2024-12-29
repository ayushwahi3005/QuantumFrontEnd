import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerResetPasswordService {

  endpoint=environment.endpoint;
  
  constructor(private httpClient:HttpClient) { 
    // console.log(environment.firebaseConfig)
  }
  sendOTPToEmail(data:any):Observable<any>{
    console.log(data)
    return this.httpClient.post(this.endpoint+'customer/sentResetOTP',data);
  }
  updatePassword(data:any):Observable<any>{
    console.log(data)
    return this.httpClient.post(this.endpoint+'customer/updatePassword',data);
  }

}
