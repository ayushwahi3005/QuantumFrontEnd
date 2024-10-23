import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InventoryModuleService {

  constructor(private httpClient:HttpClient) { }
  addExtraFields(data:any):Observable<any>{
    return this.httpClient.post("http://localhost:8084/inventory/addExtraFieldName",data);
  }
  getExtraFields(id:string):Observable<any>{
   
    return this.httpClient.get("http://localhost:8084/inventory/getExtraFieldName/"+id);
  }
  removeExtraField(id:string):Observable<any>{
    return this.httpClient.delete("http://localhost:8084/inventory/deleteExtraFieldName/"+id);
  }
  mandatoryFields(data:any):Observable<any>{
    return this.httpClient.post("http://localhost:8084/inventory/mandatoryFields",data);
  }
  showFields(data:any):Observable<any>{
    return this.httpClient.post("http://localhost:8084/inventory/showFields",data);
  }
  getMandatoryFields(name:any,email:any):Observable<any>{
    console.log("name",name)
    return this.httpClient.get("http://localhost:8084/inventory/getMandatoryFields/"+name+"/"+email);
  }
  getShowFields(name:any,email:any):Observable<any>{
    return this.httpClient.get("http://localhost:8084/inventory/getShowFields/"+name+"/"+email);
  }
  getAllMandatoryFields(email:any):Observable<any>{
    return this.httpClient.get("http://localhost:8084/inventory/getAllMandatoryFields/"+email);
  }
  getAllShowFields(email:any):Observable<any>{
    return this.httpClient.get("http://localhost:8084/inventory/getAllShowFields/"+email);
  }
  deleteShowAndMandatoryFields(name:any,email:any):Observable<any>{
    return this.httpClient.delete("http://localhost:8084/inventory/deleteShowAndMandatoryField/"+name+"/"+email,);
  }
}
