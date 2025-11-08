import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  constructor(private httpClient: HttpClient) { }
  endpoint = environment.endpoint

  getNotification(email: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('authToken')}`).set('device-id', `${localStorage.getItem('deviceId')}`);;
    return this.httpClient.get(this.endpoint + 'notification/user/' + email, { headers });
  }
  updateNotification(notificationList: any, email: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('authToken')}`).set('device-id', `${localStorage.getItem('deviceId')}`);;
    return this.httpClient.post(this.endpoint + 'notification/user/' + email, notificationList, {
      headers,
      responseType: 'text' as 'json'
    });
  }
  removeSession(userId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json',
      'Device-ID': `${localStorage.getItem('deviceId')}`,
    });

    return this.httpClient.delete(this.endpoint + 'customer/removeSession/' + userId, { headers });
  }


  dashboard(email: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      'Device-ID': `${localStorage.getItem('deviceId')}`,
      'Content-Type': 'application/json'

    });

    return this.httpClient.get(this.endpoint + 'customer/get/' + email, { headers });
  }
}
