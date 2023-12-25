import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private httpClient:HttpClient) { }

  login(email:string):Observable<any>{
    return this.httpClient.get('http://localhost:8080/customer/get/'+email);
  }
}
