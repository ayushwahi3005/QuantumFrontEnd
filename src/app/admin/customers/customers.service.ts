import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  adminEndpoint=environment.endpoint+"admin/";
  constructor(private httpClient:HttpClient) { }
   private headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json',
      // 'Device-ID': `${localStorage.getItem('deviceId')}`
    });
   getAllCustomers():Observable<any>{
      return this.httpClient.get(this.adminEndpoint+'customers',{headers:this.headers});
    }
     resendFirebaseVerificationEmail(companyId:any,email:any):Observable<any>{
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json',
        'device-id': `${localStorage.getItem('deviceId')}`,
      });
      return this.httpClient.post(this.adminEndpoint+"resend-email-firebase-verification/"+companyId+"/"+email,null,{headers});
    }
}
