import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private headers = new HttpHeaders({
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    'Content-Type': 'application/json'
  });

  customerEndpoint=environment.endpoint+"customer/";
  userEndpoint=environment.endpoint+"users/"


  constructor(private httpClient:HttpClient) { }

  checkSubscription(email:string):Observable<any>{
    console.log("email->",email);
    return this.httpClient.get(this.customerEndpoint+'getsubscription/'+email,{headers:this.headers});
  }
  sendEmail(data:any,companyId:string):Observable<any>{
    // console.log("email->",email);
    return this.httpClient.post(this.userEndpoint+'send/'+companyId,data,{headers:this.headers});
  }
  getUsers(companyId:string):Observable<any>{
 
    return this.httpClient.get(this.userEndpoint+'getUsers/'+companyId,{headers:this.headers});
  }
  registerUser(data:any){
    return this.httpClient.post(this.userEndpoint+'registerUser',data,{headers:this.headers});
  }
  getRegisteredUsers(companyId:string):Observable<any>{
 
    return this.httpClient.get(this.customerEndpoint+'getRegisteredUsers/'+companyId,{headers:this.headers});
  }
  getUserDetails(companyId:string,email:any):Observable<any>{
 
    return this.httpClient.get(this.userEndpoint+'getUserDetails/'+companyId+'/'+email,{headers:this.headers});
  }
  getAccountInfo(email:string):Observable<any>{
    
    return this.httpClient.get(this.customerEndpoint+'accountInfo/'+email,{headers:this.headers});
  }
  updateAccountInfo(data:any):Observable<any>{
    
    return this.httpClient.post(this.customerEndpoint+'accountInfo/update',data,{headers:this.headers});
  }
  deleteUser(companyId:string,email:string){
    return this.httpClient.delete(this.userEndpoint+'deleteUserDetails/'+companyId+"/"+email,{headers:this.headers});
  }
  deleteCustomer(companyId:string,email:string){
    return this.httpClient.delete(this.customerEndpoint+'deleteAccount/'+companyId+"/"+email,{headers:this.headers});
  }
  getRoleAndPermission(id:string):Observable<any>{
    return this.httpClient.get(this.customerEndpoint+'roleAndPermission/get/'+id,{headers:this.headers});
  }
  
}
