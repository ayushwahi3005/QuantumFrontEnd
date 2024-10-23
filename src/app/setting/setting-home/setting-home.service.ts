import { HttpClient } from '@angular/common/http';
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
}
