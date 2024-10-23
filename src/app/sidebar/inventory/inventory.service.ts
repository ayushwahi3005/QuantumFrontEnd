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
  // addInventory(data:any):Observable<any>{
  //   return this.httpClient.post('http://localhost:8084/inventory/addInventory',data,{
  //     responseType:'text'
  //   });
  // }
  // addInventory(data:any):Observable<any>{
  //   return this.httpClient.post('http://localhost:8084/addInventory',data);
  // }
  addInventory(payload: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'text/plain'
    });
    // return this.httpClient.post('http://localhost:8084/addInventory', payload, { headers, responseType: 'text' });
    return this.httpClient.post('/api/addInventory', payload);
  }
  getAllInventory(companyId:string):Observable<any>{

    // const headers = new HttpHeaders({
    //   'Content-Type': 'text/plain',
    //   // 'Access-Control-Allow-Origin':'*',
    // });
    return this.httpClient.get('/api/getAllInventory/'+companyId);
  }
  deleteInventory(id:String):Observable<any>{
    return this.httpClient.delete('http://localhost:8084/inventory/deleteInventory/'+id);
  }

  getAllMandatoryFields(companyId:any):Observable<any>{
    return this.httpClient.get("http://localhost:8084/inventory/getAllMandatoryFields/"+companyId,{headers:this.headers});
  }
  getAllShowFields(companyId:any):Observable<any>{
    return this.httpClient.get("http://localhost:8084/inventory/getAllShowFields/"+companyId,{headers:this.headers});
  }
  getExtraFieldName(id:string):Observable<any>{
    return this.httpClient.get("http://localhost:8084/inventory/getExtraFieldName/"+id,{headers:this.headers});
  }

  getExtraFieldNameValue(companyId:string):Observable<any>{
    return this.httpClient.get("http://localhost:8084/inventory/getExtraFieldNameValue/"+companyId,{headers:this.headers});
  }
  addExtraFields(data:any):Observable<any>{
    return this.httpClient.post("http://localhost:8084/inventory/addfields",data,{headers:this.headers});
  }
  deleteInventoryExtraField(id:String):Observable<any>{
    return this.httpClient.delete("http://localhost:8084/inventory/deleteInventoryExtraFields/"+id,{headers:this.headers});
  }
  getTechnicalUsers(companyId:string):Observable<any>{
    return this.httpClient.get("http://localhost:8082/users/getTechnicalUser/"+companyId,{headers:this.headers});
  }
  getAllInventoryWithExtraColumn(companyId:string):Observable<any>{

    return this.httpClient.get('/api/allInventoryWithExtraFields/'+companyId);
  }
  getRoleAndPermission(id:string,name:string):Observable<any>{
    return this.httpClient.get('http://localhost:8080/customer/roleAndPermissionByName/get/'+id+'/'+name,{headers:this.headers});
  }
  advanceFilter(data:any,pageIndex:number,pageSize:number):Observable<any>{
    return this.httpClient.post('http://localhost:8084/inventory/advanceFilter/'+pageIndex+'/'+pageSize,data,{headers:this.headers});
  }
  testFUnction():Observable<any>{
   
    const headers = new HttpHeaders({
      'spring.cloud.function.definition': 'findAll'
    });
    return this.httpClient.get('/test/findAll',{headers});
  }
  
}
