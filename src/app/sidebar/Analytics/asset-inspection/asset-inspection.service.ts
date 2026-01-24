import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AssetInspectionService {

  private headers = new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json',
        'Device-ID': `${localStorage.getItem('deviceId')}`
      });
      constructor(private httpClient: HttpClient) {
    
      }
      analyticsEndpoint = environment.endpoint + "inspection/";
  
      getUserInspection(companyId: any,pageNumber?:number,pageSize?:number) {
        return this.httpClient.get(this.analyticsEndpoint + "user-inspection-analytics/"+companyId,{headers:this.headers});
      }
      getStatusDistribution(companyId: any,pageNumber?:number,pageSize?:number) {
        return this.httpClient.get(this.analyticsEndpoint + "status-distribution/"+companyId,{headers:this.headers});
      }
      getInspectionTypeCompletion(companyId: any,pageNumber?:number,pageSize?:number) {
        return this.httpClient.get(this.analyticsEndpoint + "inspection-type-completion/"+companyId,{headers:this.headers});
      }

      getLeadInspector(companyId: any,pageNumber?:number,pageSize?:number) {
        return this.httpClient.get(this.analyticsEndpoint + "lead-inspector/"+companyId,{headers:this.headers});
      }
       getInspectionDetails(companyId: any) {
        return this.httpClient.get(this.analyticsEndpoint + "inspection-details/"+companyId,{headers:this.headers});
      }

      
}
