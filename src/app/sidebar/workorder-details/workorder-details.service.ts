import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkorderDetailsService {

  constructor(private httpClient:HttpClient) { }

  updateWorkOrder(data:any):Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json'
    });
    return this.httpClient.put("http://localhost:8083/workorder/update",data,{headers});
  }
  getWorkOrder(id:string):Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json'
    });
    return this.httpClient.get("http://localhost:8083/workorder/getworkorder/"+id,{headers});
  }
 
}
