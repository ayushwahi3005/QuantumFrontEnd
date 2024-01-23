import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingMainService {
  myToken!:any
  constructor(private httpClient:HttpClient) { 
    this.myToken=localStorage.getItem('authToken');
  }
  dashboard(email:string):Observable<any>{
   
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.myToken}`);
    console.log("------->"+headers.get('Authorization'))
    return this.httpClient.get('http://localhost:8080/customer/get/'+email,{headers});
  }
  addCompanyInformation(data:any):Observable<any>{
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.myToken}`);
    return this.httpClient.post('http://localhost:8080/customer/updateCompanyInformation',data,{headers});
  }
  getCompanyInformation(email:any):Observable<any>{
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.myToken}`);
    return this.httpClient.get('http://localhost:8080/customer/getCompanyInformation/'+email,{ headers });
  }
}
