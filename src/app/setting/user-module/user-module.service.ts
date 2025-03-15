import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserModuleService {

  private headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json',
      'Device-ID': `${localStorage.getItem('deviceId')}`
    });
    constructor(private httpClient:HttpClient) { 
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json',
        'Device-ID': `${localStorage.getItem('deviceId')}`
      });
    }
    // customerEndpoint="myCustomer/"
    userEndpoint=environment.endpoint+"users/"
    //  userEndpoint="http://localhost:8081/companycustomer/"
    addExtraFields(data:any):Observable<any>{
      return this.httpClient.post(this.userEndpoint+"addExtraFieldName",data,{headers:this.headers});
    }
    getExtraFields(id:string):Observable<any>{
     
      return this.httpClient.get(this.userEndpoint+"getExtraFieldName/"+id,{headers:this.headers});
    }
    // addExtraFields(data:any):Observable<any>{
    //   const headers = new HttpHeaders({
    //     'spring.cloud.function.definition': 'addExtraFieldName'
    //   });
    //   return this.httpClient.post("myCustomer/addExtraFieldName",data,{headers});
    // }
    // getExtraFields(id:string):Observable<any>{
    //   const headers = new HttpHeaders({
    //     'spring.cloud.function.definition': 'getExtraFieldName'
    //   });
    //   return this.httpClient.post("myCustomer/getExtraFieldName",id,{headers});
    // }
    removeExtraField(id:string):Observable<any>{
      // const headers = new HttpHeaders({
      //   'spring.cloud.function.definition': 'deleteExtraFieldName'
      // });
      return this.httpClient.delete(this.userEndpoint+"deleteExtraFieldName/"+id,{headers:this.headers});
      // return this.httpClient.post("myCustomer/deleteExtraFieldName",id,{headers});
    }
    mandatoryFields(data:any):Observable<any>{
      // const headers = new HttpHeaders({
      //   'spring.cloud.function.definition': 'mandatoryFields'
      // });
      return this.httpClient.post(this.userEndpoint+"mandatoryFields",data,{headers:this.headers});
      // return this.httpClient.post("myCustomer/mandatoryFields",data,{headers});
    }
    showFields(data:any):Observable<any>{
      // const headers = new HttpHeaders({
      //   'spring.cloud.function.definition': 'showFields'
      // });
      return this.httpClient.post(this.userEndpoint+"showFields",data,{headers:this.headers});
      // return this.httpClient.post("myCustomer/showFields",data,{headers});
    
    }
    getMandatoryFields(name:any,companyId:any):Observable<any>{
      console.log("name",name)
      const obj={
        "name":name,
        "companyId":companyId
    }
      return this.httpClient.get(this.userEndpoint+"getMandatoryFields/"+name+"/"+companyId,{headers:this.headers});
      // return this.httpClient.post("http://localhost:8085/getMandatoryFields/",obj,{headers:this.headers});
    }
    getShowFields(name:any,email:any):Observable<any>{
      return this.httpClient.get(this.userEndpoint+"getShowFields/"+name+"/"+email,{headers:this.headers});
    }
    getAllMandatoryFields(email:any):Observable<any>{
      return this.httpClient.get(this.userEndpoint+"getAllMandatoryFields/"+email,{headers:this.headers});
    }
    getAllShowFields(email:any):Observable<any>{
      return this.httpClient.get(this.userEndpoint+"getAllShowFields/"+email,{headers:this.headers});
    }
    // getMandatoryFields(name:any,companyId:any):Observable<any>{
    //   console.log("name",name)
    //   const headers = new HttpHeaders({
    //     'spring.cloud.function.definition': 'getMandatoryFields',
    //     'company':companyId
    //   });
    //   return this.httpClient.post("myCustomer/getMandatoryFields/",name,{headers});
    // }
    // getShowFields(name:any,companyId:any):Observable<any>{
    //   const headers = new HttpHeaders({
    //     'spring.cloud.function.definition': 'getShowFields',
    //     'company':companyId
    //   });
    //   return this.httpClient.post("myCustomer/getShowFields/",name,{headers});
    // }
    // getAllMandatoryFields(companyId:any):Observable<any>{
    //   const headers = new HttpHeaders({
    //     'spring.cloud.function.definition': 'getAllMandatoryFields'
    //   });
    //   return this.httpClient.post("myCustomer/getAllMandatoryFields",companyId,{headers});
    // }
    // getAllShowFields(companyId:any):Observable<any>{
    //   const headers = new HttpHeaders({
    //     'spring.cloud.function.definition': 'getAllShowFields'
    //   });
    //   return this.httpClient.post("myCustomer/getAllShowFields",companyId,{headers});
    // }
    deleteShowAndMandatoryFields(name:any,companyId:any):Observable<any>{
      // const headers = new HttpHeaders({
      //   'spring.cloud.function.definition': 'deleteShowAndMandatoryField',
      //   'name':name,
      //   'companyId':companyId
      // });
      return this.httpClient.delete(this.userEndpoint+"deleteShowAndMandatoryField/"+name+"/"+companyId,{headers:this.headers});
      // return this.httpClient.post("myCustomer/deleteShowAndMandatoryField",companyId,{headers});
    }
  
}
