import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AssetInspectionCompletionTrendService {

  private headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json',
      'Device-ID': `${localStorage.getItem('deviceId')}`,
    });
  
    constructor(private httpClient: HttpClient) {}
    inspectionEndpoint = environment.endpoint + 'inspection/';

     getInspectionCompletionTrendByDateRange(companyId: any, startDate: any, endDate: any): Observable<any> {
        return this.httpClient.get(
          this.inspectionEndpoint + 'inspection-complete-per-day/' + companyId+'?startDate=' + startDate + '&endDate=' + endDate,
          { headers: this.headers },
        );
      }
}
