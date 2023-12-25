import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { InventoryComponent } from './inventory.component';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  constructor(private httpClient:HttpClient) { }
  dashboard(email:string):Observable<any>{
    return this.httpClient.get('http://localhost:8080/customer/get/'+email);
  }
  addInventory(data:any):Observable<any>{
    return this.httpClient.post('http://localhost:8084/inventory/addInventory',data,{
      responseType:'text'
    });
  }
  getAllInventory():Observable<any>{
    return this.httpClient.get('http://localhost:8084/inventory/getAllInventory');
  }
  deleteInventory(id:String):Observable<any>{
    return this.httpClient.delete('http://localhost:8084/inventory/deleteInventory/'+id);
  }
  
}
