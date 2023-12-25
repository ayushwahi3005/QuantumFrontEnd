import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssetsService {

  constructor(private httpClient:HttpClient) { }

  getAssets(email:string):Observable<any>{
    console.log("email->",email);
    return this.httpClient.get('http://localhost:8081/assets/'+email);
  }
  addAssets(myFile:any,email:string):Observable<any>{
    return this.httpClient.post('http://localhost:8081/assets/import/'+email,myFile);
  }
  uploadImage(data:any):Observable<any>{
    return this.httpClient.post("http://localhost:8081/assets/imageUpload",data);
  }
  removeImage(id:string):Observable<any>{
   
    return this.httpClient.post("http://localhost:8081/assets/removeImage",id);
  }
  removeAsset(id:string):Observable<any>{
    return this.httpClient.post("http://localhost:8081/assets/removeAsset",id);
  }
  getExtraFieldName(id:string):Observable<any>{
    return this.httpClient.get("http://localhost:8081/assets/getExtraFieldName/"+id);
  }
  getExtraFieldNameValue(email:string):Observable<any>{
    return this.httpClient.get("http://localhost:8081/assets/getExtraFieldNameValue/"+email);
  }
  
}
