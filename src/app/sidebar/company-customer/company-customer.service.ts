import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyCustomerService {
  private headers = new HttpHeaders({
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    'Content-Type': 'application/json'
  });

  constructor(private httpClient:HttpClient) { }
  companyCustomerEndpoint=environment.endpoint+"companycustomer/"

  customerEndpoint=environment.endpoint+"customer/";
  // companyCustomerEndpoint="http://localhost:8081/companycustomer/"
  addCompanyCustomer(data:any):Observable<any>{
    // const headers = new HttpHeaders({
    //   'spring.cloud.function.definition': 'addCompanyCustomer'
    // });
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json'
    });
    return this.httpClient.post(this.companyCustomerEndpoint+"addCompanyCustomer",data,{headers});
    // return this.httpClient.post("/myCustomer/addCompanyCustomer",data,{headers});
  }
  getCompanyCustomer(companyId:string):Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json'
    });
    return this.httpClient.get(this.companyCustomerEndpoint+"allCompanyCustomer/"+companyId,{headers});
    // return this.httpClient.get("/myCustomer/allCompanyCustomer/"+companyId,{headers});
  }
  // getSearchedCompanyCustomerList(companyId:string,data:any,category:any):Observable<any>{
  //   const headers = new HttpHeaders({
  //     'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
  //     'Content-Type': 'application/json'
  //   });
  //   return this.httpClient.get("http://localhost:8085/companycustomer/searchWorkorderlist/"+companyId+"?data="+data+"&category="+category,{headers});
  // }
  // getSortedCompanyCustomerList(companyId:string,category:any,type:any):Observable<any>{
    
  //   return this.httpClient.get("http://localhost:8085/companycustomer/sortWorkorderlist/"+companyId+"?category="+category,{headers:this.headers});
  // }

  // getOneCompanyCustomer(id:string):Observable<any>{
  //   const headers = new HttpHeaders({
  //     'spring.cloud.function.definition': 'getcompanycustomer'
  //   });
  //   return this.httpClient.get("/myCustomer/getcompanycustomer/"+id,{headers});
  // }
  deleteCompanyCustomer(id:string):Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json'
    });
    // return this.httpClient.delete("/myCustomer/deleteCompanyCustomer/"+id,{headers});
    return this.httpClient.get(this.companyCustomerEndpoint+"deleteCompanyCustomer/"+id,{headers});
  }
  getAllMandatoryFields(companyId:any):Observable<any>{
    // const headers = new HttpHeaders({
    //   'spring.cloud.function.definition': 'getAllMandatoryFields'
    // });
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json'
    });
    // return this.httpClient.post("/myCustomer/getAllMandatoryFields",companyId,{headers});
    return this.httpClient.get(this.companyCustomerEndpoint+"getAllMandatoryFields/"+companyId,{headers});
  }
  getAllShowFields(companyId:any):Observable<any>{
    // const headers = new HttpHeaders({
    //   'spring.cloud.function.definition': 'getAllShowFields'
    // });
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json'
    });
    // return this.httpClient.post("/myCustomer/getAllShowFields",companyId,{headers});
    return this.httpClient.get(this.companyCustomerEndpoint+"getAllShowFields/"+companyId,{headers});
  }
  getExtraFieldName(id:string):Observable<any>{
    // const headers = new HttpHeaders({
    //   'spring.cloud.function.definition': 'getExtraFieldName'
    // });
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json'
    });
    // return this.httpClient.post("/myCustomer/getExtraFieldName",id,{headers});
    return this.httpClient.get(this.companyCustomerEndpoint+"getExtraFieldName/"+id,{headers});
  }

  getExtraFieldNameValue(companyId:string):Observable<any>{
    // const headers = new HttpHeaders({
    //   'spring.cloud.function.definition': 'getExtraFieldNameValue'
    // });
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json'
    });
    // return this.httpClient.post("/myCustomer/getExtraFieldNameValue",companyId,{headers});
    return this.httpClient.get(this.companyCustomerEndpoint+"getExtraFieldNameValue/"+companyId,{headers});
  }
  addExtraFields(data:any):Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json'
    });
    // return this.httpClient.post("/myCustomer/addfields",data,{headers});
    return this.httpClient.post(this.companyCustomerEndpoint+"addfields",data,{headers});
  }
  deleteWorkorderExtraField(id:String):Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json'
    });
    // return this.httpClient.delete("/myCustomer/deleteCompanyCustomerExtraFields/"+id,{headers:this.headers});
    return this.httpClient.delete(this.companyCustomerEndpoint+"deleteCompanyCustomerExtraFields/"+id,{headers});
  }

  getAllCompanyCustomerWithExtraColumn(companyId:string):Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json'
    });
    // return this.httpClient.get("/myCustomer/allCompanyCustomerWithExtraFields/"+companyId,{headers});
    return this.httpClient.get(this.companyCustomerEndpoint+"allCompanyCustomerWithExtraFields/"+companyId,{headers});
  }
  getRoleAndPermission(id:string,name:string):Observable<any>{
    return this.httpClient.get(this.customerEndpoint+'roleAndPermissionByName/get/'+id+'/'+name,{headers:this.headers});
  }

  // advanceFilter(data:any,pageIndex:number,pageSize:number,category:any,searchData:any):Observable<any>{
  //   return this.httpClient.post('http://localhost:8085/companycustomer/advanceFilter/'+pageIndex+'/'+pageSize+"?category="+category+"&search="+searchData,data);
  // }
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
  advanceFilter(data:any,pageIndex:number,pageSize:number,category:any,searchData:any,asc:any):Observable<any>{
   
    const obj={
      "filter":data,
      "pageNumber":pageIndex,
      "pageSize":pageSize,
      "category":category,
      "searchData":searchData
    }
    // const headers = new HttpHeaders({
    //   'spring.cloud.function.definition': 'advanceFilter'
    // });
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json'
    });
    console.log(data)
    // return this.httpClient.post('/myCustomer/advanceFilter',obj,{headers}) .pipe(
    //   catchError(this.handleError)
    // );
    return this.httpClient.post(this.companyCustomerEndpoint+"advanceFilter/"+pageIndex+'/'+pageSize+"?category="+category+"&search="+searchData+"&asc="+asc,data,{headers});
    
  }
  working():Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json'
    });
    // return this.httpClient.get('/myCustomer/working',{headers, responseType: 'text'});
    return this.httpClient.get(this.companyCustomerEndpoint+"working",{headers,responseType: 'text'});
 
  }
  stateList():Observable<any>{

    return this.httpClient.get(this.companyCustomerEndpoint+"statelist",{headers:this.headers});
   
  }

  getCompanyCustomerCategory(companyId:any):Observable<any>{
    return this.httpClient.get(this.companyCustomerEndpoint+"getCategoryActiveList/"+companyId,{headers:this.headers});
  }
}
