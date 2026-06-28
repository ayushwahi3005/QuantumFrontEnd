import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuditLogService {
  private baseUrl = environment.endpoint + 'audit';

  constructor(private http: HttpClient) { }

   private headers = new HttpHeaders({
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    'Content-Type': 'application/json',
    'Device-ID': `${localStorage.getItem('deviceId')}`,
  });

  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getAuditLogs(companyId: number, filters: any): Observable<any> {
    const url = `${this.baseUrl}/logs/${companyId}`;
    return this.http.post(url, filters,{headers:this.headers});
  }

  getLogsByModule(companyId: number, module: string, sortDirection: string = 'DESC', page: number = 0, size: number = 20): Observable<any> {
    const url = `${this.baseUrl}/module/${companyId}?module=${module}&sortDirection=${sortDirection}&page=${page}&size=${size}`;
    return this.http.get(url,{headers:this.headers});
  }

  getEntityHistory(companyId: number, entityId: string): Observable<any> {
    const url = `${this.baseUrl}/trail/${companyId}/${entityId}`;
    return this.http.get(url, {headers:this.headers});
  }

  getAvailableModules(): Observable<any> {
    const url = `${this.baseUrl}/modules`;
    return this.http.get(url,{headers:this.headers});
  }
}
