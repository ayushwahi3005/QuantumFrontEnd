import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminHomeService {

  adminEndpoint=environment.endpoint+"admin/";
  private headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json',
      // 'Device-ID': `${localStorage.getItem('deviceId')}`
    });
  constructor(private httpClient:HttpClient) { }
    
  public getAdminHomeData(startDate: string, endDate: string, period: string): Observable<any> {
    return this.httpClient.get(`${this.adminEndpoint}api/analytics/subscriptions/analytics?startDate=${startDate}&endDate=${endDate}&period=${period}`, { headers: this.headers } );
  }
}
