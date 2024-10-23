import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingMainService {
  myToken!:any
  constructor(private httpClient:HttpClient) { 
    this.myToken=localStorage.getItem('authToken');
  }
  // endpoint="http://customer-lb2-1979550990.us-east-1.elb.amazonaws.com:8080/";
  customerEndpoint=environment.endpoint
  
  // endpoint="http://localhost:8080/";
  dashboard(email:string):Observable<any>{
   
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.myToken}`);
    console.log("------->"+headers.get('Authorization'))
    return this.httpClient.get(this.customerEndpoint+'customer/get/'+email,{headers});
  }
  addCompanyInformation(data:any):Observable<any>{
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.myToken}`);
    return this.httpClient.post(this.customerEndpoint+'customer/updateCompanyInformation',data,{headers});
  }
  getCompanyInformation(email:any):Observable<any>{
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.myToken}`);
    return this.httpClient.get(this.customerEndpoint+'customer/getCompanyInformation/'+email,{ headers });
  }
}
