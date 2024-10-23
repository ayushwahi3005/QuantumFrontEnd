import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AssetCategoryService {

  private headers = new HttpHeaders({
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    'Content-Type': 'application/json'
  });

  constructor(private httpClient:HttpClient) {
    
   }
  //  customerEndpoint=environment.endpoint+"customer/";
   assetEndpoint=environment.endpoint+"assets/"
  // assetEndpoint="http://localhost:8080/assets/"
  // companyCustomerEndpoint="http://localhost:8080/companycustomer/"
  //  companyCustomerEndpoint=environment.endpoint+"companycustomer/"

   addAssetCategory(data:any):Observable<any>{
    return this.httpClient.post(this.assetEndpoint+"addCategory",data,{headers:this.headers});
  }

  getAssetCategory(companyId:any):Observable<any>{
    return this.httpClient.get(this.assetEndpoint+"getCategoryList/"+companyId,{headers:this.headers});
  }

  deleteAssetCategory(companyId:any):Observable<any>{
    return this.httpClient.delete(this.assetEndpoint+"deleteCategory/"+companyId,{headers:this.headers});
  }
  updateAssetCategory(data:any):Observable<any>{
    return this.httpClient.put(this.assetEndpoint+"updateCategory",data,{headers:this.headers});
  }
}
