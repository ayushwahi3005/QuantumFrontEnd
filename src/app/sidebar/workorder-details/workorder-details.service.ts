import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkorderDetailsService {

  constructor(private httpClient:HttpClient) { }

  updateWorkOrder(data:any):Observable<any>{
    return this.httpClient.put("http://localhost:8083/workorder/update",data);
  }
  getWorkOrder(id:string):Observable<any>{
    return this.httpClient.get("http://localhost:8083/workorder/getworkorder/"+id);
  }
 
}
