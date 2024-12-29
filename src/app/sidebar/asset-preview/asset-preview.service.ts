import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AssetPreviewService {
  private headers = new HttpHeaders({
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    'Content-Type': 'application/json',
    'Device-ID': `${localStorage.getItem('deviceId')}`
  });
  constructor(private httpClient:HttpClient) { 
    
  }
  assetEndpoint=environment.endpoint+"assets/";
  companyCustomerEndpoint=environment.endpoint+"companycustomer/";
  userEndpoint=environment.endpoint+"users/";
  getAsset(id:string):Observable<any>{
   
    return this.httpClient.get(this.assetEndpoint+"getAsset/"+id,{headers:this.headers});
  }

  getExtraFields(id:string):Observable<any>{
    return this.httpClient.get(this.assetEndpoint+"getExtraFields/"+id,{headers:this.headers});
  }

  getExtraFieldName(id:string):Observable<any>{
    return this.httpClient.get(this.assetEndpoint+"getExtraFieldName/"+id,{headers:this.headers});
  }
  getCheckInOutList(id:string):Observable<any>{
    return this.httpClient.get(this.assetEndpoint+"getCheckInOutList/"+id,{headers:this.headers});
  }
 
  
  getAssetFile(assetId:string):Observable<any>{
    return this.httpClient.get(this.assetEndpoint+"getFile/"+assetId,{
      reportProgress: true,
      // responseType:'blob'
      headers:this.headers
    });
  }
  download(id:string):Observable<any>{
    return this.httpClient.get(this.assetEndpoint+"getFile/download/"+id,{
      
      responseType: 'blob',
      headers:this.headers
    });
  }
  
  getWorkOrders(id:string):Observable<any>{
    return this.httpClient.get("http://localhost:8083/workorder/getworkorderlist/"+id,{headers:this.headers});
  }
  getMandatoryFields(name:any,companyId:any):Observable<any>{
    console.log("name",name)
    return this.httpClient.get(this.assetEndpoint+"getMandatoryFields/"+name+"/"+companyId,{headers:this.headers});
  }
  getShowFields(name:any,companyId:any):Observable<any>{
    return this.httpClient.get(this.assetEndpoint+"getShowFields/"+name+"/"+companyId,{headers:this.headers});
  }
  getAllMandatoryFields(companyId:any):Observable<any>{
    return this.httpClient.get(this.assetEndpoint+"getAllMandatoryFields/"+companyId,{headers:this.headers});
  }
  getAllShowFields(companyId:any):Observable<any>{
    console.log("myemail",companyId);
    return this.httpClient.get(this.assetEndpoint+"getAllShowFields/"+companyId,{headers:this.headers});
  }

  getCompanyCustomer(customerId:string):Observable<any>{
    // const headers = new HttpHeaders({
    //   'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    //   'Content-Type': 'application/json'
    // });
    return this.httpClient.get(this.companyCustomerEndpoint+"getCompanyCustomer/"+customerId,{headers:this.headers});
  }
  getQR(companyId:string):Observable<any>{
    // console.log("companyId->",companyId);
    return this.httpClient.get(this.assetEndpoint+"getQRData/"+companyId,{headers:this.headers});
  }

  addCheckInOut(data:any):Observable<any>{
    return this.httpClient.post(this.assetEndpoint+"addCheckInOut",data,{headers:this.headers});
  }
  getTechnicalUsers(companyId:string):Observable<any>{
    return this.httpClient.get(this.userEndpoint+"getTechnicalUser/"+companyId,{headers:this.headers});
  }
  deleteFile(id:string):Observable<any>{
    return this.httpClient.delete(this.assetEndpoint+"deleteFile/"+id,{headers:this.headers});
  }
}
