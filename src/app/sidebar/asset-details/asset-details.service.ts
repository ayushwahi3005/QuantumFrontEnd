import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssetDetailsService {

  constructor(private httpClient:HttpClient) { }
  updateAsset(data:any):Observable<any>{
    return this.httpClient.put('http://localhost:8081/assets/addassets',data);
  }
  uploadImage(data:any):Observable<any>{
    return this.httpClient.post("http://localhost:8081/assets/imageUpload",data);
  }
  removeImage(id:string):Observable<any>{
   
    return this.httpClient.post("http://localhost:8081/assets/removeImage",id);
  }
  getAsset(id:string):Observable<any>{
   
    return this.httpClient.get("http://localhost:8081/assets/getAsset/"+id);
  }
  addExtraFields(data:any):Observable<any>{
    return this.httpClient.post("http://localhost:8081/assets/addfields",data);
  }
  getExtraFields(id:string):Observable<any>{
    return this.httpClient.get("http://localhost:8081/assets/getExtraFields/"+id);
  }
  removeExtraField(id:string):Observable<any>{
    return this.httpClient.delete("http://localhost:8081/assets/deleteExtraFields/"+id);
  }
  removeAsset(id:string):Observable<any>{
    return this.httpClient.post("http://localhost:8081/assets/removeAsset",id);
  }
  getExtraFieldName(id:string):Observable<any>{
    return this.httpClient.get("http://localhost:8081/assets/getExtraFieldName/"+id);
  }
  getCheckInOutList(id:string):Observable<any>{
    return this.httpClient.get("http://localhost:8081/assets/getCheckInOutList/"+id);
  }
  addCheckInOut(data:any):Observable<any>{
    return this.httpClient.post("http://localhost:8081/assets/addCheckInOut",data);
  }
  addAssetFile(file:File,asseId:string):Observable<any>{
    const formData: FormData = new FormData();

    formData.append('file', file);
    const req = new HttpRequest('POST', "http://localhost:8081/assets/addFile/"+asseId, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.httpClient.request(req);
    
  }
  getAssetFile(assetId:string):Observable<any>{
    return this.httpClient.get("http://localhost:8081/assets/getFile/"+assetId,{
      reportProgress: true,
      // responseType:'blob'
    });
  }
  download(id:string):Observable<any>{
    return this.httpClient.get("http://localhost:8081/assets/getFile/download/"+id,{
      
      responseType: 'blob'
    });
  }
  deleteFile(id:string):Observable<any>{
    return this.httpClient.delete("http://localhost:8081/assets/deleteFile/"+id);
  }
  getWorkOrders(id:string):Observable<any>{
    return this.httpClient.get("http://localhost:8083/workorder/getworkorderlist/"+id);
  }
  
}
