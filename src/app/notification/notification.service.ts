import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import { Subject } from 'rxjs';
import * as SockJS from 'sockjs-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private stompClient!: Client;
  private notificationSubject = new Subject<string>();
  private subscribed = false;
  companyId: string | null = localStorage.getItem('companyId');
  userId!:string;

  constructor() {
    this.userId=localStorage.getItem('user')||'';
    this.connect();
  }

  connect() {
    const token = localStorage.getItem('authToken');
  
    
    if (!token) {
      console.error('No authentication token available');
      return;
    }

    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(environment.endpoint+'assetyug-notifications'),
      //  webSocketFactory: () => new SockJS('http://localhost:8080/assetyug-notifications'),
      connectHeaders: {
        'Authorization': `Bearer ${token}`
      },
      reconnectDelay: 5000,
      debug: (str) => console.log('STOMP:', str), // Add debug logging
      onConnect: (frame) => {
        console.log('Connected:', frame);
        this.subscribeToNotifications(); // Moved subscription here
      },
      onStompError: (frame) => {
        console.error('Error:', frame.headers['message'], frame.body);
      }
    });

    this.stompClient.activate();
  }

  // private subscribeToNotifications() {
  //   if (this.subscribed) return;
    
  //   this.stompClient.subscribe('/topic/notifications', (message) => {
  //     console.log('Received message:', message); // Debug log
  //     if (message.body) {
  //       this.notificationSubject.next(message.body);
  //     }
  //   });
    
  //   this.subscribed = true;
  // }

//   private subscribeToNotifications(): void {
//   if (this.subscribed || !this.stompClient) return;

//   const companyId = localStorage.getItem('companyId'); // example
//   console.log('Subscribing to notifications for company:', companyId);

//   // 🔔 Global notifications
//   this.stompClient.subscribe('/topic/global/notifications', message => {
//     console.log(message)
//     if (message.body) {
//       this.notificationSubject.next(JSON.parse(message.body));
//     }
//   });

//   // 🏢 Company-specific notifications
//   if (companyId) {
//     this.stompClient.subscribe(`/topic/companies/${companyId}/notifications`, message => {
//       console.log(message)
//       if (message.body) {
//         this.notificationSubject.next(JSON.parse(message.body));
//       }
//     });
//   }



//   this.subscribed = true;
// }

  private subscribeToNotifications() {
    if (this.subscribed) return;
    console.log('/topic/user/'+this.userId+'/notifications')
    this.stompClient.subscribe('/topic/user/'+this.userId+'/notifications', (message) => {
      console.log('Received message:', message); // Debug log
      if (message.body) {
        this.notificationSubject.next(message.body);
      }
    });
    
    this.subscribed = true;
  }


  getNotificationObservable() {
    return this.notificationSubject.asObservable();
  }

  disconnect() {
    if (this.stompClient?.active) {
      this.stompClient.deactivate();
      this.subscribed = false;
    }
  }
}