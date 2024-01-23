import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssetPreviewService {
  private headers = new HttpHeaders({
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    'Content-Type': 'application/json'
  });
  constructor(private httpClient:HttpClient) { 
    
  }

  getAsset(id:string):Observable<any>{
   
    return this.httpClient.get("http://localhost:8081/assets/getAsset/"+id,{headers:this.headers});
  }

  getExtraFields(id:string):Observable<any>{
    return this.httpClient.get("http://localhost:8081/assets/getExtraFields/"+id,{headers:this.headers});
  }

  getExtraFieldName(id:string):Observable<any>{
    return this.httpClient.get("http://localhost:8081/assets/getExtraFieldName/"+id,{headers:this.headers});
  }
  getCheckInOutList(id:string):Observable<any>{
    return this.httpClient.get("http://localhost:8081/assets/getCheckInOutList/"+id,{headers:this.headers});
  }
 
  
  getAssetFile(assetId:string):Observable<any>{
    return this.httpClient.get("http://localhost:8081/assets/getFile/"+assetId,{
      reportProgress: true,
      // responseType:'blob'
      headers:this.headers
    });
  }
  download(id:string):Observable<any>{
    return this.httpClient.get("http://localhost:8081/assets/getFile/download/"+id,{
      
      responseType: 'blob',
      headers:this.headers
    });
  }
  
  getWorkOrders(id:string):Observable<any>{
    return this.httpClient.get("http://localhost:8083/workorder/getworkorderlist/"+id,{headers:this.headers});
  }
  getMandatoryFields(name:any,companyId:any):Observable<any>{
    console.log("name",name)
    return this.httpClient.get("http://localhost:8081/assets/getMandatoryFields/"+name+"/"+companyId,{headers:this.headers});
  }
  getShowFields(name:any,companyId:any):Observable<any>{
    return this.httpClient.get("http://localhost:8081/assets/getShowFields/"+name+"/"+companyId,{headers:this.headers});
  }
  getAllMandatoryFields(companyId:any):Observable<any>{
    return this.httpClient.get("http://localhost:8081/assets/getAllMandatoryFields/"+companyId,{headers:this.headers});
  }
  getAllShowFields(companyId:any):Observable<any>{
    console.log("myemail",companyId);
    return this.httpClient.get("http://localhost:8081/assets/getAllShowFields/"+companyId,{headers:this.headers});
  }
}
