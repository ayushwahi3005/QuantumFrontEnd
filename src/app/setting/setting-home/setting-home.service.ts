import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingHomeService {

  constructor(private httpClient:HttpClient) { }
  // endpoint="http://customer-lb2-1979550990.us-east-1.elb.amazonaws.com:8080/";
  endpoint=environment.endpoint
  
  dashboard(email:string):Observable<any>{
    return this.httpClient.get(this.endpoint+'customer/get/'+email);
  }
   getNotification(email:any):Observable<any>{
        const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('authToken')}`).set('device-id', `${localStorage.getItem('deviceId')}`);;
        return this.httpClient.get(environment.endpoint+'notification/user/'+email,{ headers });
      }
        updateNotification(notificationList:any,email:any):Observable<any>{
        const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('authToken')}`).set('device-id', `${localStorage.getItem('deviceId')}`);;
        return this.httpClient.post(environment.endpoint+'notification/user/'+email,notificationList,{
           headers,
            responseType: 'text' as 'json'
           });
      }
}
