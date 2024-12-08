import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private triggerFunctionSubject = new Subject<void>();
  // endpoint="http://customer-lb2-1979550990.us-east-1.elb.amazonaws.com:8080/";
  endpoint=environment.endpoint;
  
  constructor(private httpClient:HttpClient) { 
    // console.log(environment.firebaseConfig)
  }

  isSameBrowserAndDevice(data:any):Observable<any>{
    console.log(data)
    return this.httpClient.post(this.endpoint+'customer/isSameBrowserAndDevice',data);
  }

  login(email:string):Observable<any>{
    return this.httpClient.get(this.endpoint+'customer/get/'+email);
  }
  triggerComponentFunction(data:any) {
    console.log("trigger vallleeddd")
    this.triggerFunctionSubject.next(data);
  }

  getTriggerFunctionSubject() {
    return this.triggerFunctionSubject.asObservable();
  }
  removeSession(userId:string):Observable<any>{
    
    
    return this.httpClient.delete(this.endpoint+'customer/removeSession/'+userId);
  }
  demo():Observable<any>{
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json',
      'device-id':'6876f415-7575-4499-a53f-2530003efbb1'
    });
    return this.httpClient.get(this.endpoint+'customer/working',{ headers, responseType: 'text' as 'json' });
  }

  

}
