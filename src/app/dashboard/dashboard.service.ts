// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class DashboardService {
  
//   constructor(private httpClient:HttpClient) { }
//   endpoint="http://customer-lb1-1592953855.us-east-1.elb.amazonaws.com:8080/";
//   dashboard(email:string):Observable<any>{
//     const headers = new HttpHeaders({
//       'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
//       'Content-Type': 'application/json',
//       'spring.cloud.function.definition': 'getFile'
//     });
//     // const headers = new HttpHeaders({
//     //   'spring.cloud.function.definition': 'getFile'
//     // });
//     // return this.httpClient.get('http://localhost:8080/customer/get/'+email, { headers });
//     return this.httpClient.post(this.endpoint+'customer/getCustomer/',email, { headers });
    
//   }
// }


import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DashboardComponent } from './dashboard.component';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private componentMethodCallSource = new BehaviorSubject<any>(null);
  componentMethodCalled$ = this.componentMethodCallSource.asObservable();

  // Service method to emit data
  callComponentMethod(data: any) {
    console.log(data);
    this.componentMethodCallSource.next(data);
  }
  constructor(private httpClient:HttpClient) { }
  // endpoint="http://customer-lb2-1979550990.us-east-1.elb.amazonaws.com:8080/";
  endpoint=environment.endpoint
 
  dashboard(email:string):Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      'Device-ID': `${localStorage.getItem('deviceId')}`,
      'Content-Type': 'application/json'
      
    });
    
    return this.httpClient.get(this.endpoint+'customer/get/'+email, { headers });
  }
  removeSession(userId:string):Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json',
      'Device-ID': `${localStorage.getItem('deviceId')}`,
    });
    
    return this.httpClient.delete(this.endpoint+'customer/removeSession/'+userId, { headers });
  }
  getCompanyInformation(email:any):Observable<any>{
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('authToken')}`).set('device-id', `${localStorage.getItem('deviceId')}`);;
    return this.httpClient.get(this.endpoint+'customer/getCompanyInformation/'+email,{ headers });
  }
 
  


}

