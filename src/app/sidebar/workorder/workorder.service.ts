import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkOrderService {
  private headers = new HttpHeaders({
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    'Content-Type': 'application/json'
  });
  constructor(private httpClient:HttpClient) { }

  addWorkOrder(data:any):Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json'
    });
    return this.httpClient.post("http://localhost:8083/workorder/addorder",data,{headers});
  }
  getWorkOrder(companyId:string):Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json'
    });
    return this.httpClient.get("http://localhost:8083/workorder/getallorder/"+companyId,{headers});
  }
  getSearchedWorkOrderList(companyId:string,data:any,category:any):Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json'
    });
    return this.httpClient.get("http://localhost:8083/workorder/searchWorkorderlist/"+companyId+"?data="+data+"&category="+category,{headers});
  }
  getSortedWorkOrderList(companyId:string,category:any):Observable<any>{
    
    return this.httpClient.get("http://localhost:8083/workorder/sortWorkorderlist/"+companyId+"?category="+category,{headers:this.headers});
  }
  getAssets(companyId:string):Observable<any>{
    console.log("companyId->",companyId);
    return this.httpClient.get('http://localhost:8081/assets/'+companyId);
  }
  getOneWorkOrder(id:string):Observable<any>{
    return this.httpClient.get("http://localhost:8083/workorder/getworkorder/"+id,{headers:this.headers});
  }
  deleteWorkOrder(id:string):Observable<any>{
    return this.httpClient.delete("http://localhost:8083/workorder/delete/"+id,{headers:this.headers});
  }
}
