import { HttpClient } from '@angular/common/http';
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
 

  

}
