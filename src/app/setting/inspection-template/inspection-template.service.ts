import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Inspection } from './Inspection';

@Injectable({
  providedIn: 'root'
})
export class InspectionTemplateService {

  endpoint=environment.endpoint;
    private headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json',
      'Device-ID': `${localStorage.getItem('deviceId')}`
    });
    constructor(private httpClient:HttpClient) { }

    getAllAssetInspection(id:string):Observable<any>{
        return this.httpClient.get(this.endpoint+'assets/getAllAssetInspection/'+id,{headers:this.headers});
      }
    addAssetInspection(obj:Inspection):Observable<any>{
        return this.httpClient.post(this.endpoint+'assets/addAssetInspection',obj,{headers:this.headers});
      }
      deleteAssetInspection(id:string):Observable<any>{
        return this.httpClient.delete(this.endpoint+'assets/deleteAssetInspection/'+id,{headers:this.headers});
      }


      assetEndpoint=environment.endpoint+"assets/"

      getAssetCategory(companyId:any):Observable<any>{
        return this.httpClient.get(this.assetEndpoint+"getCategoryList/"+companyId,{headers:this.headers});
      }
}
