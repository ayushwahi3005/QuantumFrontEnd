import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EditInventoryService {
  private headers = new HttpHeaders({
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    'Content-Type': 'application/json'
  });
  constructor(private httpClient:HttpClient) { }
  dashboard(companyId:string):Observable<any>{
    return this.httpClient.get('http://localhost:8080/customer/get/'+companyId);
  }
  addInventory(data:any):Observable<any>{
    return this.httpClient.post('http://localhost:8084/inventory/addInventory',data,{
      responseType:'text'
    });
  }
  updateInventory(data:any):Observable<any>{
    return this.httpClient.post('http://localhost:8084/inventory/updateInventory',data,{
      responseType:'text'
    });
  }
  getInventory(id:string):Observable<any>{
    return this.httpClient.get('http://localhost:8084/inventory/getInventory/'+id);
  }
  deleteInventory(id:String):Observable<any>{
    return this.httpClient.delete('http://localhost:8084/inventory/deleteInventory/'+id);
  }

  addExtraFields(data:any):Observable<any>{
    return this.httpClient.post("http://localhost:8084/inventory/addfields",data,{headers:this.headers});
  }
  getExtraFields(id:string):Observable<any>{
    return this.httpClient.get("http://localhost:8084/inventory/getExtraFields/"+id,{headers:this.headers});
  }
  removeExtraField(id:string):Observable<any>{
    return this.httpClient.delete("http://localhost:8084/inventory/deleteExtraFields/"+id,{headers:this.headers});
  }
  removeAsset(id:string):Observable<any>{
    return this.httpClient.post("http://localhost:8084/inventory/removeAsset",id,{headers:this.headers});
  }
  getExtraFieldName(id:string):Observable<any>{
    return this.httpClient.get("http://localhost:8084/inventory/getExtraFieldName/"+id,{headers:this.headers});
  }
  getMandatoryFields(name:any,companyId:any):Observable<any>{
    console.log("name",name)
    return this.httpClient.get("http://localhost:8084/inventory/getMandatoryFields/"+name+"/"+companyId,{headers:this.headers});
  }
  getShowFields(name:any,companyId:any):Observable<any>{
    return this.httpClient.get("http://localhost:8084/inventory/getShowFields/"+name+"/"+companyId,{headers:this.headers});
  }
  getAllMandatoryFields(companyId:any):Observable<any>{
    return this.httpClient.get("http://localhost:8084/inventory/getAllMandatoryFields/"+companyId,{headers:this.headers});
  }
  getAllShowFields(companyId:any):Observable<any>{
    return this.httpClient.get("http://localhost:8084/inventory/getAllShowFields/"+companyId,{headers:this.headers});
  }
}
