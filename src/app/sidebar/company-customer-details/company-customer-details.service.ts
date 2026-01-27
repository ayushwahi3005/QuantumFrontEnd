import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyCustomerDetailsService {
  private headers = new HttpHeaders({
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    'Content-Type': 'application/json',
    'Device-ID': `${localStorage.getItem('deviceId')}`,
    'companyId': `${localStorage.getItem('companyId')}`,
  });
  constructor(private httpClient:HttpClient) { }
 companyCustomerEndpoint=environment.endpoint+"companycustomer/"
 customerEndpoint=environment.endpoint+"customer/"
 assetEndpoint=environment.endpoint+"assets/"
 countryEndpoint=environment.endpoint+"country/"
// companyCustomerEndpoint="http://localhost:8081/companycustomer/"
  updateCompanyCustomer(data:any):Observable<any>{
    
    return this.httpClient.put(this.companyCustomerEndpoint+"updateCompanyCustomer",data,{headers:this.headers});
  }
  getCompanyCustomer(id:any):Observable<any>{
    return this.httpClient.get(this.companyCustomerEndpoint+"getCompanyCustomer/"+id,{headers:this.headers});
  }
  addExtraFields(data:any):Observable<any>{
    return this.httpClient.post(this.companyCustomerEndpoint+"addfields",data,{headers:this.headers});
  }
  getExtraFields(id:string):Observable<any>{
    return this.httpClient.get(this.companyCustomerEndpoint+"getExtraFields/"+id,{headers:this.headers});
  }
  removeAsset(id:string):Observable<any>{
    return this.httpClient.post(this.companyCustomerEndpoint+"deleteCompanyCustomer",id,{headers:this.headers});
  }
  getExtraFieldName(id:string):Observable<any>{
    return this.httpClient.get(this.companyCustomerEndpoint+"getExtraFieldName/"+id,{headers:this.headers});
  }
  getMandatoryFields(name:any,companyId:any):Observable<any>{
    console.log("name",name)
    return this.httpClient.get(this.companyCustomerEndpoint+"getMandatoryFields/"+name+"/"+companyId,{headers:this.headers});
  }
  getShowFields(name:any,companyId:any):Observable<any>{
    return this.httpClient.get(this.companyCustomerEndpoint+"getShowFields/"+name+"/"+companyId,{headers:this.headers});
  }
  getAllMandatoryFields(companyId:any):Observable<any>{
    return this.httpClient.get(this.companyCustomerEndpoint+"getAllMandatoryFields/"+companyId,{headers:this.headers});
  }
  getAllShowFields(companyId:any):Observable<any>{
    return this.httpClient.get(this.companyCustomerEndpoint+"getAllShowFields/"+companyId,{headers:this.headers});
  }
  // addCompanyCustomerFile(file:any,companyId:any):Observable<any>{
  //  let myHeaders = new HttpHeaders({
  //     'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
  //     'Content-Type': 'multipart/form-data'
  //   });
  //   myHeaders.append('Content-Type', 'multipart/form-data');
  //   // const headers = new HttpHeaders({
  //   //   'spring.cloud.function.definition': 'addFile',
  //   //   'company':companyId,
  //   // });
  //   const formData: FormData = new FormData();

  //   formData.append('file', file);
  //   const req = new HttpRequest('POST', this.companyCustomerEndpoint+"addFile/"+companyId, formData, {
  //     headers:myHeaders,  
  //   reportProgress: true,
  //     responseType: 'json'
     
  //   });
  //   return this.httpClient.request(req).pipe(
  //         catchError(error => {
  //           console.error('File upload failed:', error);
  //           throw error; // You can handle the error as needed
  //         })
  //       )
  // }

  addCompanyCustomerFile(file: any, companyId: any): Observable<any> {
    let myHeaders = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    'Device-ID': `${localStorage.getItem('deviceId')}`,
    'companyId': `${localStorage.getItem('companyId')}`,
      // Don't set 'Content-Type' here!
    });
  
    const formData: FormData = new FormData();
    formData.append('file', file);
  
    const req = new HttpRequest('POST', this.companyCustomerEndpoint + "addFile/" + companyId, formData, {
      headers: myHeaders,
      reportProgress: true,
      responseType: 'json'
    });
  
    return this.httpClient.request(req).pipe(
      catchError(error => {
        console.error('File upload failed:', error);
        throw error; // You can handle the error as needed
      })
    );
  }

  

  download(id:string):Observable<any>{
    return this.httpClient.get(this.companyCustomerEndpoint+"getFile/download/"+id,{
      headers:this.headers,
      responseType: 'blob'
    });
  }
  
  deleteFile(id:string):Observable<any>{
   
    return this.httpClient.delete(this.companyCustomerEndpoint+"deleteFile/"+id,{headers:this.headers});
  }
  getCompanyCustomerFile(assetId:string):Observable<any>{
    return this.httpClient.get(this.companyCustomerEndpoint+"getFile/"+assetId,{
      reportProgress: true,
      headers:this.headers
      // responseType:'blob'
    });
    
  }
  getAssetByCustomerId(customerId:string,pageNumber:number):Observable<any>{
    return this.httpClient.get(this.assetEndpoint+"getByCutomerId/"+customerId+'/'+pageNumber,{
  
      headers:this.headers
      // responseType:'blob'
    });
  }
  getWorkOrderByCustomerId(customerId:string):Observable<any>{
    return this.httpClient.get("http://localhost:8083/workorder/getWorkOrderListByCustomerId/"+customerId,{
  
      headers:this.headers
      // responseType:'blob'
    });
  }
  deleteCompanyCustomer(id:string):Observable<any>{
    return this.httpClient.delete(this.companyCustomerEndpoint+"deleteCompanyCustomer/"+id,{headers:this.headers});
  }
  // deleteWorkOrder(id:string):Observable<any>{
  //   return this.httpClient.delete("http://localhost:8083/workorder/delete/"+id,{headers:this.headers});
  // }
  // deleteAsset(id:string):Observable<any>{
  //   return this.httpClient.post("http://localhost:8081/assets/removeAsset",id,{headers:this.headers});
  // }
  closeWorkOrders(id:string):Observable<any>{
    return this.httpClient.post("http://localhost:8083/workorder/updateWorkOrdersWithClosed",id,{headers:this.headers});
  }
  inActiveAssets(id:string):Observable<any>{
    return this.httpClient.post(this.assetEndpoint+"updateAssetsWithInActive",id,{headers:this.headers});
  }
  getRoleAndPermission(id:string,name:string):Observable<any>{
    return this.httpClient.get(this.customerEndpoint+'roleAndPermissionByName/get/'+id+'/'+name,{headers:this.headers});
  }

  // advanceFilter(data:any,pageIndex:number,pageSize:number,category:any):Observable<any>{
  //   return this.httpClient.post(this.assetEndpoint+'advanceFilter/'+pageIndex+'/'+pageSize+"?category="+category,data,{headers:this.headers});
  // }
  getCustomerCategory(companyId:any):Observable<any>{
    return this.httpClient.get(this.companyCustomerEndpoint+"getCategoryActiveList/"+companyId,{headers:this.headers});
  }
  stateList():Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json',
      'device-id': `${localStorage.getItem('deviceId')}`,
      'companyId': `${localStorage.getItem('companyId')}`,
    });
    return this.httpClient.get(this.companyCustomerEndpoint+"statelist",{headers});
   
  }

  countryStateList(country:any):Observable<any>{
      const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json',
      'device-id': `${localStorage.getItem('deviceId')}`,
      'companyId': `${localStorage.getItem('companyId')}`,
    });
      return this.httpClient.get(this.countryEndpoint+"states/"+country,{headers:headers});
     
    }
  
}
