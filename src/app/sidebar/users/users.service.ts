import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private headers = new HttpHeaders({
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    'Content-Type': 'application/json'
  });
  constructor(private httpClient:HttpClient) { }

  checkSubscription(email:string):Observable<any>{
    console.log("email->",email);
    return this.httpClient.get('http://localhost:8080/customer/getsubscription/'+email,{headers:this.headers});
  }
}
