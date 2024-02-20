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
  sendEmail(data:any,companyId:string):Observable<any>{
    // console.log("email->",email);
    return this.httpClient.post('http://localhost:8082/users/send/'+companyId,data,{headers:this.headers});
  }
  getUsers(companyId:string):Observable<any>{
 
    return this.httpClient.get('http://localhost:8082/users/getUsers/'+companyId,{headers:this.headers});
  }
  registerUser(data:any){
    return this.httpClient.post('http://localhost:8082/users/registerUser',data,{headers:this.headers});
  }
}
