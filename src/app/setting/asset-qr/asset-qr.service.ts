import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AssetQRService {
  private headers = new HttpHeaders({
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    'Content-Type': 'application/json',
    'Device-ID': `${localStorage.getItem('deviceId')}`,
  });
  constructor(private httpClient:HttpClient) { }
  assetEndpoint=environment.endpoint+"assets/"
  getAssets(companyId:string):Observable<any>{
    console.log("companyId->",companyId);
    return this.httpClient.get(this.assetEndpoint+""+companyId,{headers:this.headers});
  }
  updateQR(data:any):Observable<any>{
   
    return this.httpClient.post(this.assetEndpoint+"saveQRData",data,{headers:this.headers});
  }
  getQR(companyId:string):Observable<any>{
    // console.log("companyId->",companyId);
    return this.httpClient.get(this.assetEndpoint+"getQRData/"+companyId,{headers:this.headers});
  }
}
