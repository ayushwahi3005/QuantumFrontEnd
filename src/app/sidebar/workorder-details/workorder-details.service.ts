import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkorderDetailsService {
  private headers = new HttpHeaders({
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    'Content-Type': 'application/json'
  });
  constructor(private httpClient:HttpClient) { 
    
  }

  updateWorkOrder(data:any):Observable<any>{
    
    return this.httpClient.put("http://localhost:8083/workorder/update",data,{headers:this.headers});
  }
  getWorkOrder(id:string):Observable<any>{

    return this.httpClient.get("http://localhost:8083/workorder/getworkorder/"+id,{headers:this.headers});
  }
  addExtraFields(data:any):Observable<any>{
    return this.httpClient.post("http://localhost:8083/workorder/addfields",data,{headers:this.headers});
  }
  getExtraFields(id:string):Observable<any>{
    return this.httpClient.get("http://localhost:8083/workorder/getExtraFields/"+id,{headers:this.headers});
  }
  removeExtraField(id:string):Observable<any>{
    return this.httpClient.delete("http://localhost:8083/workorder/deleteExtraFields/"+id,{headers:this.headers});
  }
  removeAsset(id:string):Observable<any>{
    return this.httpClient.post("http://localhost:8083/workorder/removeAsset",id,{headers:this.headers});
  }
  getExtraFieldName(id:string):Observable<any>{
    return this.httpClient.get("http://localhost:8083/workorder/getExtraFieldName/"+id,{headers:this.headers});
  }
  getMandatoryFields(name:any,companyId:any):Observable<any>{
    console.log("name",name)
    return this.httpClient.get("http://localhost:8083/workorder/getMandatoryFields/"+name+"/"+companyId,{headers:this.headers});
  }
  getShowFields(name:any,companyId:any):Observable<any>{
    return this.httpClient.get("http://localhost:8083/workorder/getShowFields/"+name+"/"+companyId,{headers:this.headers});
  }
  getAllMandatoryFields(companyId:any):Observable<any>{
    return this.httpClient.get("http://localhost:8083/workorder/getAllMandatoryFields/"+companyId,{headers:this.headers});
  }
  getAllShowFields(companyId:any):Observable<any>{
    return this.httpClient.get("http://localhost:8083/workorder/getAllShowFields/"+companyId,{headers:this.headers});
  }

  getCompanyCustomerList(companyId:string):Observable<any>{
    // const headers = new HttpHeaders({
    //   'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    //   'Content-Type': 'application/json'
    // });
    return this.httpClient.get("http://localhost:8085/companycustomer/allCompanyCustomer/"+companyId,{headers:this.headers});
  }

  // updateAsset(data:any):Observable<any>{
  //   return this.httpClient.put('http://localhost:8083/workorder/addassets',data,{headers:this.headers});
  // }
 
}
