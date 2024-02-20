import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvitationService {
  
  constructor(private httpClient:HttpClient) { }
  
  register(data:any):Observable<any>{
  
    return this.httpClient.post('http://localhost:8080/customer/addUser',data);
  }
  getUser(companyId:string,token:string){
    return this.httpClient.get('http://localhost:8082/users/invite/getUser/'+companyId+'/'+token);
  }
}
