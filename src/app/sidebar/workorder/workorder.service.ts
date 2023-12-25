import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkOrderService {

  constructor(private httpClient:HttpClient) { }

  addWorkOrder(data:any):Observable<any>{
    return this.httpClient.post("http://localhost:8083/workorder/addorder",data);
  }
  getWorkOrder(email:string):Observable<any>{
    return this.httpClient.get("http://localhost:8083/workorder/getallorder/"+email);
  }
  getAssets(email:string):Observable<any>{
    console.log("email->",email);
    return this.httpClient.get('http://localhost:8081/assets/'+email);
  }
  getOneWorkOrder(id:string):Observable<any>{
    return this.httpClient.get("http://localhost:8083/workorder/getworkorder/"+id);
  }
  deleteWorkOrder(id:string):Observable<any>{
    return this.httpClient.delete("http://localhost:8083/workorder/delete/"+id);
  }
}
