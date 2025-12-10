import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AssetInsightsService {

   private headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json',
      'Device-ID': `${localStorage.getItem('deviceId')}`
    });
    constructor(private httpClient: HttpClient) {
  
    }
    assetEndpoint = environment.endpoint + "assets/";

    getCheckinOutData(companyId: any){
      return this.httpClient.get(this.assetEndpoint + "checkInOutAssetData/"+companyId,{headers:this.headers});
    }
}
