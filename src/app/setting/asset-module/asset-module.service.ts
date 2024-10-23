import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AssetModuleService {
  private headers = new HttpHeaders({
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    'Content-Type': 'application/json'
  });
  constructor(private httpClient:HttpClient) { }
  customerEndpoint=environment.endpoint+"customer/";
  assetEndpoint=environment.endpoint+"assets/"
  // assetEndpoint="http://localhost:8080/assets/"
  companyCustomerEndpoint=environment.endpoint+"companycustomer/"
    addExtraFields(data:any):Observable<any>{
      return this.httpClient.post(this.assetEndpoint+"addExtraFieldName",data,{headers:this.headers});
    }
    getExtraFields(id:string):Observable<any>{
     
      return this.httpClient.get(this.assetEndpoint+"getExtraFieldName/"+id,{headers:this.headers});
    }
    removeExtraField(id:string):Observable<any>{
      return this.httpClient.delete(this.assetEndpoint+"deleteExtraFieldName/"+id,{headers:this.headers});
    }
    mandatoryFields(data:any):Observable<any>{
      return this.httpClient.post(this.assetEndpoint+"mandatoryFields",data,{headers:this.headers});
    }
    showFields(data:any):Observable<any>{
      return this.httpClient.post(this.assetEndpoint+"showFields",data,{headers:this.headers});
    }
    getMandatoryFields(name:any,email:any):Observable<any>{
      console.log("name",name)
      return this.httpClient.get(this.assetEndpoint+"getMandatoryFields/"+name+"/"+email,{headers:this.headers});
    }
    getShowFields(name:any,email:any):Observable<any>{
      return this.httpClient.get(this.assetEndpoint+"getShowFields/"+name+"/"+email,{headers:this.headers});
    }
    getAllMandatoryFields(email:any):Observable<any>{
      return this.httpClient.get(this.assetEndpoint+"getAllMandatoryFields/"+email,{headers:this.headers});
    }
    getAllShowFields(email:any):Observable<any>{
      return this.httpClient.get(this.assetEndpoint+"getAllShowFields/"+email,{headers:this.headers});
    }
    deleteShowAndMandatoryFields(name:any,email:any):Observable<any>{
      return this.httpClient.delete(this.assetEndpoint+"deleteShowAndMandatoryField/"+name+"/"+email,{headers:this.headers});
    }
  
}
