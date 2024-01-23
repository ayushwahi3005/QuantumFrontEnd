import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssetModuleService {

  constructor(private httpClient:HttpClient) { }

  addExtraFields(data:any):Observable<any>{
    return this.httpClient.post("http://localhost:8081/assets/addExtraFieldName",data);
  }
  getExtraFields(id:string):Observable<any>{
   
    return this.httpClient.get("http://localhost:8081/assets/getExtraFieldName/"+id);
  }
  removeExtraField(id:string):Observable<any>{
    return this.httpClient.delete("http://localhost:8081/assets/deleteExtraFieldName/"+id);
  }
  mandatoryFields(data:any):Observable<any>{
    return this.httpClient.post("http://localhost:8081/assets/mandatoryFields",data);
  }
  showFields(data:any):Observable<any>{
    return this.httpClient.post("http://localhost:8081/assets/showFields",data);
  }
  getMandatoryFields(name:any,email:any):Observable<any>{
    console.log("name",name)
    return this.httpClient.get("http://localhost:8081/assets/getMandatoryFields/"+name+"/"+email);
  }
  getShowFields(name:any,email:any):Observable<any>{
    return this.httpClient.get("http://localhost:8081/assets/getShowFields/"+name+"/"+email);
  }
  getAllMandatoryFields(email:any):Observable<any>{
    return this.httpClient.get("http://localhost:8081/assets/getAllMandatoryFields/"+email);
  }
  getAllShowFields(email:any):Observable<any>{
    return this.httpClient.get("http://localhost:8081/assets/getAllShowFields/"+email);
  }
  deleteShowAndMandatoryFields(name:any,email:any):Observable<any>{
    return this.httpClient.delete("http://localhost:8081/assets/deleteShowAndMandatoryField/"+name+"/"+email,);
  }
}
