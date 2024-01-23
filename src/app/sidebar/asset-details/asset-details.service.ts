import { HttpClient, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssetDetailsService {
  private headers = new HttpHeaders({
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    'Content-Type': 'application/json'
  });

  constructor(private httpClient:HttpClient) {
    
   }
  updateAsset(data:any):Observable<any>{
    return this.httpClient.put('http://localhost:8081/assets/addassets',data,{headers:this.headers});
  }
  uploadImage(data:any):Observable<any>{
    return this.httpClient.post("http://localhost:8081/assets/imageUpload",data ,{headers:this.headers});
  }
  removeImage(id:string):Observable<any>{
   
    return this.httpClient.post("http://localhost:8081/assets/removeImage",id,{headers:this.headers});
  }
  getAsset(id:string):Observable<any>{
   
    return this.httpClient.get("http://localhost:8081/assets/getAsset/"+id,{headers:this.headers});
  }
  addExtraFields(data:any):Observable<any>{
    return this.httpClient.post("http://localhost:8081/assets/addfields",data,{headers:this.headers});
  }
  getExtraFields(id:string):Observable<any>{
    return this.httpClient.get("http://localhost:8081/assets/getExtraFields/"+id,{headers:this.headers});
  }
  removeExtraField(id:string):Observable<any>{
    return this.httpClient.delete("http://localhost:8081/assets/deleteExtraFields/"+id,{headers:this.headers});
  }
  removeAsset(id:string):Observable<any>{
    return this.httpClient.post("http://localhost:8081/assets/removeAsset",id,{headers:this.headers});
  }
  getExtraFieldName(id:string):Observable<any>{
    return this.httpClient.get("http://localhost:8081/assets/getExtraFieldName/"+id,{headers:this.headers});
  }
  getCheckInOutList(id:string):Observable<any>{
    return this.httpClient.get("http://localhost:8081/assets/getCheckInOutList/"+id,{headers:this.headers});
  }
  addCheckInOut(data:any):Observable<any>{
    return this.httpClient.post("http://localhost:8081/assets/addCheckInOut",data,{headers:this.headers});
  }
  addAssetFile(file:File,asseId:string):Observable<any>{

    // let myHeaders = new HttpHeaders({
    //   'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    //   'Content-Type': 'multipart/form-data'
    // });
    // myHeaders.append('Content-Type', 'multipart/form-data');
    const formData: FormData = new FormData();

    formData.append('file', file);
    const req = new HttpRequest('POST', "http://localhost:8081/assets/addFile/"+asseId, formData, {
      // headers:myHeaders,  
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
    return this.httpClient.get("http://localhost:8081/assets/getFile/"+assetId,{
      reportProgress: true,
      headers:this.headers
      // responseType:'blob'
    });
  }
  download(id:string):Observable<any>{
    return this.httpClient.get("http://localhost:8081/assets/getFile/download/"+id,{
      headers:this.headers,
      responseType: 'blob'
    });
  }
  deleteFile(id:string):Observable<any>{
    return this.httpClient.delete("http://localhost:8081/assets/deleteFile/"+id,{headers:this.headers});
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
    return this.httpClient.get("http://localhost:8081/assets/getAllShowFields/"+companyId,{headers:this.headers});
  }
  
}
