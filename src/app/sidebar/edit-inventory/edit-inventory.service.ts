import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EditInventoryService {

  constructor(private httpClient:HttpClient) { }
  dashboard(companyId:string):Observable<any>{
    return this.httpClient.get('http://localhost:8080/customer/get/'+companyId);
  }
  addInventory(data:any):Observable<any>{
    return this.httpClient.post('http://localhost:8084/inventory/addInventory',data,{
      responseType:'text'
    });
  }
  getInventory(id:string):Observable<any>{
    return this.httpClient.get('http://localhost:8084/inventory/getInventory/'+id);
  }
  deleteInventory(id:String):Observable<any>{
    return this.httpClient.delete('http://localhost:8084/inventory/deleteInventory/'+id);
  }
}
