import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvitationService {

  constructor(private httpClient:HttpClient) { }
  
  register(companyId:string,token:string,data:any):Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json'
    });
    return this.httpClient.post('http://localhost:8082/users/invite/'+companyId+'/'+token,data);
  }
}
