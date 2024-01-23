import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { InventoryComponent } from './inventory.component';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private headers = new HttpHeaders({
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    'Content-Type': 'application/json'
  });
  constructor(private httpClient:HttpClient) { }
  dashboard(companyId:string):Observable<any>{
    return this.httpClient.get('http://localhost:8080/customer/get/'+companyId,{headers:this.headers});
  }
  addInventory(data:any):Observable<any>{
    return this.httpClient.post('http://localhost:8084/inventory/addInventory',data,{
      responseType:'text'
    });
  }
  getAllInventory(companyId:string):Observable<any>{
    return this.httpClient.get('http://localhost:8084/inventory/getAllInventory/'+companyId);
  }
  deleteInventory(id:String):Observable<any>{
    return this.httpClient.delete('http://localhost:8084/inventory/deleteInventory/'+id);
  }
  
}
