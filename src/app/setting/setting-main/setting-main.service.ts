import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingMainService {

  constructor(private httpClient:HttpClient) { }
  dashboard(email:string):Observable<any>{
    return this.httpClient.get('http://localhost:8080/customer/get/'+email);
  }
}
