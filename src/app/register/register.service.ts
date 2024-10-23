import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private triggerFunctionSubjectRegister = new Subject<void>();
  // endpoint="http://customer-lb2-1979550990.us-east-1.elb.amazonaws.com:8080/";
   endpoint=environment.endpoint
  constructor(private httpClient:HttpClient) { }

  register(formData:any):Observable<any>{
    return this.httpClient.post(this.endpoint+'customer/addCustomer', formData);
  }
  addCompanyInformation(data:any):Observable<any>{
    
    return this.httpClient.post(this.endpoint+'customer/addCompanyInformation',data);
  }
  triggerComponentFunctionRegister(data:any) {
    console.log("trigger register vallleeddd")
    this.triggerFunctionSubjectRegister.next(data);
  }

  getTriggerFunctionSubjectRegister() {
    return this.triggerFunctionSubjectRegister.asObservable();
  }
}
