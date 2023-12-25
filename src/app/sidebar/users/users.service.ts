import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private httpClient:HttpClient) { }

  checkSubscription(email:string):Observable<any>{
    console.log("email->",email);
    return this.httpClient.get('http://localhost:8080/customer/getsubscription/'+email);
  }
}
