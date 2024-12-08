import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminLoginService {

  private headers = new HttpHeaders({
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    'Content-Type': 'application/json',
    'Device-ID': `${localStorage.getItem('deviceId')}`,
  });
  constructor(private httpClient:HttpClient) { }

 adminEndpoint=environment.endpoint+"admin/"


  login(data:any):Observable<any>{
   return this.httpClient.post(this.adminEndpoint+"login",data);
  }

}
