import { HttpClient, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, catchError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AssetDetailsService {
  private headers = new HttpHeaders({
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    'Content-Type': 'application/json',
    'Device-ID': `${localStorage.getItem('deviceId')}`
  });

  constructor(private httpClient:HttpClient) {
    
   }
   customerEndpoint=environment.endpoint+"customer/";
   assetEndpoint=environment.endpoint+"assets/"
   userEndpoint=environment.endpoint+"users/";
  // assetEndpoint="http://localhost:8080/assets/"
  // companyCustomerEndpoint="http://localhost:8080/companycustomer/"
   companyCustomerEndpoint=environment.endpoint+"companycustomer/"
  //  assetEndpoint="http://localhost:8080/assets/"
  updateAsset(data:any):Observable<any>{
    return this.httpClient.put(this.assetEndpoint+"addassets",data,{headers:this.headers});
  }
  uploadImage(data:any):Observable<any>{
    return this.httpClient.post(this.assetEndpoint+"imageUpload",data ,{headers:this.headers});
  }
  removeImage(id:string):Observable<any>{
   
    return this.httpClient.post(this.assetEndpoint+"removeImage",id,{headers:this.headers});
  }
  getAsset(id:string):Observable<any>{
   
    return this.httpClient.get(this.assetEndpoint+"getAsset/"+id,{headers:this.headers});
  }
  addExtraFields(data:any):Observable<any>{
    return this.httpClient.post(this.assetEndpoint+"addfields",data,{headers:this.headers});
  }
  getExtraFields(id:string):Observable<any>{
    return this.httpClient.get(this.assetEndpoint+"getExtraFields/"+id,{headers:this.headers});
  }
  removeExtraField(id:string):Observable<any>{
    return this.httpClient.delete(this.assetEndpoint+"deleteExtraFields/"+id,{headers:this.headers});
  }
  removeAsset(id:string):Observable<any>{
    return this.httpClient.post(this.assetEndpoint+"removeAsset",id,{headers:this.headers});
  }
  getExtraFieldName(id:string):Observable<any>{
    return this.httpClient.get(this.assetEndpoint+"getExtraFieldName/"+id,{headers:this.headers});
  }
  getCheckInOutList(id:string):Observable<any>{
    return this.httpClient.get(this.assetEndpoint+"getCheckInOutList/"+id,{headers:this.headers});
  }
  addCheckInOut(data:any):Observable<any>{
    return this.httpClient.post(this.assetEndpoint+"addCheckInOut",data,{headers:this.headers});
  }
  addAssetFile(file:File,asseId:string):Observable<any>{

    // let myHeaders = new HttpHeaders({
    //   'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    //   'Content-Type': 'multipart/form-data'
    // });
    // myHeaders.append('Content-Type', 'multipart/form-data');
    let myHeaders = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
       'Device-ID': `${localStorage.getItem('deviceId')}`
      // Don't set 'Content-Type' here!
    });
    const formData: FormData = new FormData();

    formData.append('file', file);
    const req = new HttpRequest('POST', this.assetEndpoint+"addFile/"+asseId, formData, {
      // headers:myHeaders,
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
  getAssetFile(assetId:string):Observable<any>{
    return this.httpClient.get(this.assetEndpoint+"getFile/"+assetId,{
      reportProgress: true,
      headers:this.headers
      // responseType:'blob'
    });
  }
  download(id:string):Observable<any>{
    return this.httpClient.get(this.assetEndpoint+"getFile/download/"+id,{
      headers:this.headers,
      responseType: 'blob'
    });
  }
  deleteFile(id:string):Observable<any>{
    return this.httpClient.delete(this.assetEndpoint+"deleteFile/"+id,{headers:this.headers});
  }
  // getWorkOrders(id:string):Observable<any>{
    
  //   return this.httpClient.get("http://localhost:8083/workorder/getworkorderlist/"+id,{headers:this.headers});
  // }
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
    return this.httpClient.get(this.assetEndpoint+"getAllShowFields/"+companyId,{headers:this.headers});
  }
  getTechnicalUsers(companyId:string):Observable<any>{
    return this.httpClient.get(this.userEndpoint+"getTechnicalUser/"+companyId,{headers:this.headers});
  }
  getQR(companyId:string):Observable<any>{
    // console.log("companyId->",companyId);
    return this.httpClient.get(this.assetEndpoint+"getQRData/"+companyId,{headers:this.headers});
  }

  getCompanyCustomerList(companyId:string):Observable<any>{
    // const headers = new HttpHeaders({
    //   'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    //   'Content-Type': 'application/json'
    // });
    return this.httpClient.get(this.companyCustomerEndpoint+"allCompanyCustomer/"+companyId,{headers:this.headers});
  }
  getRoleAndPermission(id:string,name:string):Observable<any>{
    return this.httpClient.get(this.customerEndpoint+'roleAndPermissionByName/get/'+id+'/'+name,{headers:this.headers});

  }
  getAssetCategory(companyId:any):Observable<any>{
    return this.httpClient.get(this.assetEndpoint+"getCategoryActiveList/"+companyId,{headers:this.headers});
  }

  getAllAssetInspection(id:string,category:string):Observable<any>{
          return this.httpClient.get(this.assetEndpoint+'getAllAssetInspectionByCategory/'+id+'?category='+category,{headers:this.headers});
        }

  addAssetInspection(inspection:any):Observable<any>{
          return this.httpClient.post(this.assetEndpoint+'addAssetInspectionInstance',inspection,{headers:this.headers});
      }
      updateAssetInspection(inspection:any):Observable<any>{
        return this.httpClient.put(this.assetEndpoint+'addAssetInspectionInstance',inspection,{headers:this.headers});
    }
  getAllAssetInspectionInstance(id:string):Observable<any>{
        return this.httpClient.get(this.assetEndpoint+'getAllAssetInspectionInstance/'+id,{headers:this.headers});
      }
      getAllAssetInspectionInstanceByAssetId(id:string):Observable<any>{
        return this.httpClient.get(this.assetEndpoint+'getAllAssetInspectionInstanceByAssetId/'+id,{headers:this.headers});
      }
      getAllLocationWithBin(companyId:any):Observable<any>{
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
          'device-id': `${localStorage.getItem('deviceId')}`,
        });
        return this.httpClient.get(this.customerEndpoint+"locations-with-bins/"+companyId,{headers});
      }
  
}
