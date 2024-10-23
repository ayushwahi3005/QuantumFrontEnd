import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private headers = new HttpHeaders({
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    'Content-Type': 'application/json'
  });

  constructor(private httpClient:HttpClient) {
    
   }
  //  customerEndpoint=environment.endpoint+"customer/";
  //  assetEndpoint=environment.endpoint+"assets/"
  assetEndpoint="http://localhost:8080/assets/"
  // companyCustomerEndpoint="http://localhost:8080/companycustomer/"
  //  companyCustomerEndpoint=environment.endpoint+"companycustomer/"

   addCustomerCategory(data:any):Observable<any>{
    return this.httpClient.post(this.assetEndpoint+"addCategory",data,{headers:this.headers});
  }

  getCustomerCategory(companyId:any):Observable<any>{
    return this.httpClient.get(this.assetEndpoint+"getCategoryList/"+companyId,{headers:this.headers});
  }

  deleteCustomerCategory(companyId:any):Observable<any>{
    return this.httpClient.delete(this.assetEndpoint+"deleteCategory/"+companyId,{headers:this.headers});
  }
}
