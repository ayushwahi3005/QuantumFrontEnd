import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionPlanService {

  private headers = new HttpHeaders({
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    'Content-Type': 'application/json',
    'Device-ID': `${localStorage.getItem('deviceId')}`,
  });
  constructor(private httpClient:HttpClient) { }

 adminEndpoint=environment.endpoint+"admin/"

 getPlans():Observable<any>{
  return this.httpClient.get(this.adminEndpoint+"getAllPlan",{headers:this.headers});
 }
  addPlans(data:any):Observable<any>{
   return this.httpClient.post(this.adminEndpoint+"addPlan",data,{headers:this.headers});
  }
}
