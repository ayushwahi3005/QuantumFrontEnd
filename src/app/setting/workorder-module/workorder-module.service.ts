import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkorderModuleService {
  private headers = new HttpHeaders({
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    'Content-Type': 'application/json'
  });
  constructor(private httpClient:HttpClient) { 
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json'
    });
  }
  
  addExtraFields(data:any):Observable<any>{
    return this.httpClient.post("http://localhost:8083/workorder/addExtraFieldName",data,{headers:this.headers});
  }
  getExtraFields(id:string):Observable<any>{
   
    return this.httpClient.get("http://localhost:8083/workorder/getExtraFieldName/"+id,{headers:this.headers});
  }
  removeExtraField(id:string):Observable<any>{
    return this.httpClient.delete("http://localhost:8083/workorder/deleteExtraFieldName/"+id,{headers:this.headers});
  }
  mandatoryFields(data:any):Observable<any>{
    return this.httpClient.post("http://localhost:8083/workorder/mandatoryFields",data,{headers:this.headers});
  }
  showFields(data:any):Observable<any>{
    return this.httpClient.post("http://localhost:8083/workorder/showFields",data,{headers:this.headers});
  }
  getMandatoryFields(name:any,email:any):Observable<any>{
    console.log("name",name)
    return this.httpClient.get("http://localhost:8083/workorder/getMandatoryFields/"+name+"/"+email,{headers:this.headers});
  }
  getShowFields(name:any,email:any):Observable<any>{
    return this.httpClient.get("http://localhost:8083/workorder/getShowFields/"+name+"/"+email,{headers:this.headers});
  }
  getAllMandatoryFields(email:any):Observable<any>{
    return this.httpClient.get("http://localhost:8083/workorder/getAllMandatoryFields/"+email,{headers:this.headers});
  }
  getAllShowFields(email:any):Observable<any>{
    return this.httpClient.get("http://localhost:8083/workorder/getAllShowFields/"+email,{headers:this.headers});
  }
  deleteShowAndMandatoryFields(name:any,email:any):Observable<any>{
    return this.httpClient.delete("http://localhost:8083/workorder/deleteShowAndMandatoryField/"+name+"/"+email,{headers:this.headers});
  }
}
